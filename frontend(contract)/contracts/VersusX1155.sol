//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

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
        return newItemId;
    }

    function createTokenToUser(
        address to,
        string memory _uri,
        uint256 count
    ) public onlyOwner returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(to, newItemId, count, "");
        _setURI(newItemId, _uri);
        setApprovalForAll(MarketAddress, true);
        return newItemId;
    }
}
