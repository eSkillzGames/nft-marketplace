//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "hardhat/console.sol";
import "./VersusX721.sol";
import "./VersusX1155.sol";

contract VersusXMarket is
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    IERC721Receiver,
    IERC1155Receiver
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _itemIds;
    CountersUpgradeable.Counter private _collectionIds;

    uint256 listingPrice;
    uint256 public totalEarnedAmounts;
    uint256 public totalEarnedFeeAmounts;

    event VersusX721Created(VersusX721 newNFT);
    event VersusX1155Created(VersusX1155 newNFT);

    event MarketItemChanged(
        address _from,
        address to,
        uint256 ItemID,
        uint256 TokenID
    );

    function initialize() public initializer {
        listingPrice = 0.0025 ether;

        __Ownable_init();
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    struct MarketItem {
        uint itemId;
        uint tokenId;
        uint nftType; // 0: erc721, 1: erc1155
        address nftContract;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function setListingPrice(uint val) public onlyOwner {
        listingPrice = val;
    }

    function calcEarnedFeeAmounts(uint256 amount) public {
        // require(NFTContract == msg.sender, 'Only NFT Contract can list new Items');
        totalEarnedFeeAmounts = totalEarnedFeeAmounts + amount;
    }

    function deleteMarketItem(uint256 itemId) public {
        // require(NFTContract == msg.sender, 'Only NFT contract can delete Item');
        delete idToMarketItem[itemId];
    }

    function addCollection(
        uint nftType,
        string memory name,
        string memory symbol
    ) public onlyOwner {
        if (nftType == 0) {
            VersusX721 newCollection = new VersusX721(
                name,
                symbol,
                address(this)
            );
            newCollection.transferOwnership(msg.sender);
            emit VersusX721Created(newCollection);
        } else {
            VersusX1155 newCollection = new VersusX1155(address(this));
            newCollection.transferOwnership(msg.sender);
            emit VersusX1155Created(newCollection);
        }
    }

    function listItemOnSale(
        uint256 tokenId,
        uint nftType,
        address nftContract,
        uint price
    ) public payable nonReentrant {
        if (nftType == 0) {
            require(
                IERC721(nftContract).ownerOf(tokenId) == msg.sender,
                "Only owner can list new Items"
            );
        } else {
            require(
                IERC1155(nftContract).balanceOf(msg.sender, tokenId) > 0,
                "Only owner can list new Items"
            );
        }

        console.log("Checking msg.value", msg.sender, msg.value, listingPrice);

        require(
            msg.value == listingPrice,
            "Amount doesn't meet listing fees requirements (.0025eth)"
        );

        require(price > 0, "Price should be at least 1 wei");

        if (nftType == 0) {
            IERC721(nftContract).safeTransferFrom(
                msg.sender,
                address(this),
                tokenId
            );
        } else if (nftType == 1) {
            IERC1155(nftContract).safeTransferFrom(
                msg.sender,
                address(this),
                tokenId,
                1,
                ""
            );
        }

        _itemIds.increment();
        uint itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            tokenId,
            nftType,
            nftContract,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
    }

    function listItemCancelOnSale(uint itemId) public {
        require(
            idToMarketItem[itemId].seller == msg.sender &&
                idToMarketItem[itemId].sold == false,
            "only owner can cancel this item on sale"
        );

        if (idToMarketItem[itemId].nftType == 0) {
            IERC721(idToMarketItem[itemId].nftContract).safeTransferFrom(
                address(this),
                msg.sender,
                idToMarketItem[itemId].tokenId
            );
        } else if (idToMarketItem[itemId].nftType == 1) {
            IERC1155(idToMarketItem[itemId].nftContract).safeTransferFrom(
                address(this),
                msg.sender,
                idToMarketItem[itemId].tokenId,
                1,
                ""
            );
        }

        delete idToMarketItem[itemId];
    }

    function sellMarketItem(
        uint itemId,
        uint nftType,
        address nftContract
    ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;

        require(msg.value == price, "Amount must be equal to price");

        require(
            msg.sender != idToMarketItem[itemId].seller,
            "Owner shouldn't buy their NFTs"
        );

        if (nftType == 0) {
            IERC721(nftContract).safeTransferFrom(
                address(this),
                msg.sender,
                tokenId
            );
        } else if (nftType == 1) {
            IERC1155(nftContract).safeTransferFrom(
                address(this),
                msg.sender,
                tokenId,
                1,
                ""
            );
        }

        //idToMarketItem[itemId].seller.transfer(msg.value);
        (bool success, ) = payable(idToMarketItem[itemId].seller).call{value: msg.value}("");
        require(success, "ERROR in tranfer");
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;

        (bool success, ) = payable(owner()).call{value: listingPrice}("");
        require(success, "ERROR in tranfer");
        //payable(owner()).transfer(listingPrice);
    }

    function fetchMarketItems(
        address _nftAddr
    ) public view returns (MarketItem[] memory) {
        uint itemsCount = _itemIds.current();
        uint onSaleItems = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].owner == address(0) &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                onSaleItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](onSaleItems);
        uint index = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].owner == address(0) &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                MarketItem storage currentItem = idToMarketItem[i + 1];
                marketItems[index] = currentItem;
                index++;
            }
        }

        return marketItems;
    }

    function withdrawAll() public payable onlyOwner returns (bool) {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "ERROR in tranfer");
        //payable(owner()).transfer(address(this).balance);
        return true;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external pure returns (bool) {
        return
            interfaceId == type(IERC1155Receiver).interfaceId ||
            interfaceId == type(IERC721Receiver).interfaceId;
    }
}
