//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface INFTMarket {
    function createMarketItemFromNFTContract(
        uint256 tokenId,
        address _owner
    ) external;

    function getListingPrice() external view returns (uint256);

    function getIdToMarketItemOwner(
        uint itemId
    ) external view returns (address);

    function getIdToMarketItemTokenID(uint itemId) external view returns (uint);

    function owner() external view returns (address);

    function calcEarnedFeeAmounts(uint256 amount) external;

    function listItemOnSaleFromNFTContract(
        uint itemId,
        uint price,
        address _owner
    ) external payable;

    function deleteMarketItem(uint256 itemId) external;
}

contract VersusX1155 is ERC1155URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address MarketAddress;

    constructor(address _marketAddress) ERC1155("") {
        MarketAddress = _marketAddress;
    }

    function createToken(
        string memory _uri,
        uint256 count
    ) public onlyOwner returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId, count, "");
        _setURI(newItemId, _uri);
        setApprovalForAll(MarketAddress, true);
        INFTMarket(MarketAddress).createMarketItemFromNFTContract(
            newItemId,
            msg.sender
        );
        return newItemId;
    }
}
