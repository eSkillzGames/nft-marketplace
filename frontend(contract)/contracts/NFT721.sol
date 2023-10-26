//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
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

contract VersusX721 is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address MarketAddress;

    event TokenUriUpdated(address owner, uint256 tokenID, string tokenURI);

    constructor(
        string memory name_,
        string memory symbol_,
        address _marketAddress
    ) ERC721(name_, symbol_) {
        MarketAddress = _marketAddress;
    }

    function createToken(string memory uri) public onlyOwner returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, uri);
        setApprovalForAll(MarketAddress, true);
        INFTMarket(MarketAddress).createMarketItemFromNFTContract(
            newItemId,
            msg.sender
        );
        return newItemId;
    }

    function createTokenToUser(
        address to,
        string memory uri
    ) public onlyOwner returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(to, newItemId);
        _setTokenURI(newItemId, uri);
        setApprovalForAll(MarketAddress, true);
        INFTMarket(MarketAddress).createMarketItemFromNFTContract(
            newItemId,
            to
        );
        return newItemId;
    }

    function updateTokenUri(
        address tokenOwner,
        uint tokenId,
        string memory _tokenURI
    ) public onlyOwner {
        require(
            tokenOwner == ownerOf(tokenId),
            "Message sender is not owner of token. Only owner can update the URI of token."
        );
        _setTokenURI(tokenId, _tokenURI);
        emit TokenUriUpdated(tokenOwner, tokenId, _tokenURI);
    }

    function setMarketAddress(address _marketplaceAddress) external onlyOwner {
        MarketAddress = _marketplaceAddress;
    }
}
