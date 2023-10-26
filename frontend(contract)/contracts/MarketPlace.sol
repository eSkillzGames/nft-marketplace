//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "metakeep-lambda/ethereum/contracts/MetaKeepLambdaUpgradeable.sol";

contract NFTMarket is
    MetaKeepLambdaUpgradeable,
    ReentrancyGuardUpgradeable,
    IERC721ReceiverUpgradeable,
    UUPSUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    event MarketItemChanged(
        address _from,
        address to,
        uint256 ItemID,
        uint256 TokenID
    );
    CountersUpgradeable.Counter private _itemIds;
    CountersUpgradeable.Counter private _collectionIds;
    // address public erc20token;
    uint256 listingPrice;
    uint256 public totalEarnedAmounts;
    uint256 public totalEarnedFeeAmounts;
    // address public NFTContract;

    address MetaKeepOwner;

    constructor(address lambdaOwner, string memory lambdaName) {
        initialize(lambdaOwner, lambdaName);
    }

    function initialize(
        address lambdaOwner,
        string memory lambdaName
    ) public initializer {
        listingPrice = 0.0025 ether;
        // erc20token = _erec20Token;

        MetaKeepOwner = lambdaOwner;
        ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
        _MetaKeepLambda_init(lambdaOwner, lambdaName);
    }

    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(
        address
    ) internal override onlyMetaKeepLambdaOwner {}

    struct MarketItem {
        uint itemId;
        uint tokenId;
        address nftContract;
        address payable owner;
        address lastSeller;
        address[] prevOwners;
        uint price;
        uint lastPrice;
        bool onSale;
    }

    struct CollectionItem {
        uint itemId;
        address nftContract;
        string name;
        string symbol;
    }
    mapping(uint256 => CollectionItem) public collections;
    mapping(uint256 => MarketItem) private idToMarketItem;

    function owner() public view returns (address) {
        return MetaKeepOwner;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function getIdToMarketItemOwner(uint itemId) public view returns (address) {
        return idToMarketItem[itemId].owner;
    }

    function getIdToMarketItemTokenID(uint itemId) public view returns (uint) {
        return idToMarketItem[itemId].tokenId;
    }

    // function setERC20Token(address _TokenAdddress) public onlyMetaKeepLambdaOwner {
    //     erc20token = _TokenAdddress;
    // }

    // function setNFTContract(address _NFTAddress) public onlyMetaKeepLambdaOwner {
    //     NFTContract = _NFTAddress;
    // }

    function calcEarnedFeeAmounts(uint256 amount) public {
        // require(NFTContract == msg.sender, 'Only NFT Contract can list new Items');
        totalEarnedFeeAmounts = totalEarnedFeeAmounts + amount;
    }

    function createMarketItemFromNFTContract(
        uint256 tokenId,
        address _owner
    ) public {
        // require(NFTContract == msg.sender, 'Only NFT Contract can list new Items');
        _itemIds.increment();
        uint itemId = _itemIds.current();
        address[] memory prevOwners;
        idToMarketItem[itemId] = MarketItem(
            itemId,
            tokenId,
            msg.sender,
            payable(_owner),
            payable(address(0)),
            prevOwners,
            0,
            0,
            false
        );
    }

    function createMarketItem(
        uint256 tokenId,
        address nftContract
    ) public returns (uint256) {
        require(
            IERC721Upgradeable(nftContract).ownerOf(tokenId) == msg.sender,
            "Only owner can list new Items"
        );
        _itemIds.increment();
        uint itemId = _itemIds.current();
        address[] memory prevOwners;

        idToMarketItem[itemId] = MarketItem(
            itemId,
            tokenId,
            nftContract,
            payable(msg.sender),
            payable(address(0)),
            prevOwners,
            0,
            0,
            false
        );

        return itemId;
    }

    function createMarketItems(
        uint256[] memory tokenIds,
        address nftContract
    ) public {
        for (uint i = 0; i < tokenIds.length; i++) {
            require(
                IERC721Upgradeable(nftContract).ownerOf(tokenIds[i]) ==
                    msg.sender,
                "Only owner can list new Items"
            );
            _itemIds.increment();
            uint itemId = _itemIds.current();
            address[] memory prevOwners;

            idToMarketItem[itemId] = MarketItem(
                itemId,
                tokenIds[i],
                nftContract,
                payable(msg.sender),
                payable(address(0)),
                prevOwners,
                0,
                0,
                false
            );
        }
    }

    function createCollection(
        address _addr,
        string memory _name,
        string memory _symbol
    ) public {
        _collectionIds.increment();
        uint cId = _collectionIds.current();
        collections[cId] = CollectionItem(cId, _addr, _name, _symbol);
    }

    function deleteCollection(uint256 cId) public {
        // require(NFTContract == msg.sender, 'Only NFT contract can delete Item');
        delete collections[cId];
    }

    function deleteMarketItem(uint256 itemId) public {
        // require(NFTContract == msg.sender, 'Only NFT contract can delete Item');
        delete idToMarketItem[itemId];
    }

    function listItemOnSaleFromNFTContract(
        uint itemId,
        uint price,
        address _owner
    ) public payable {
        idToMarketItem[itemId].onSale = true;
        idToMarketItem[itemId].lastSeller = _owner;
        idToMarketItem[itemId].price = price;
    }

    function listItemOnSale(
        uint itemId,
        address nftContract,
        uint price
    ) public payable {
        require(
            idToMarketItem[itemId].owner == msg.sender,
            "only owner can put this item on sale"
        );
        require(
            msg.value == listingPrice,
            "Amount doesn't meet listing fees requirements (.0025eth)"
        );

        IERC721Upgradeable(nftContract).safeTransferFrom(
            msg.sender,
            address(this),
            idToMarketItem[itemId].tokenId
        );
        payable(owner()).transfer(msg.value);

        idToMarketItem[itemId].onSale = true;
        idToMarketItem[itemId].lastSeller = msg.sender;
        idToMarketItem[itemId].price = price;
    }

    function listItemCancelOnSale(
        uint itemId,
        address nftContract
    ) public payable {
        require(
            idToMarketItem[itemId].owner == msg.sender &&
                idToMarketItem[itemId].onSale,
            "only owner can cancel this item on sale"
        );
        IERC721Upgradeable(nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            idToMarketItem[itemId].tokenId
        );
        idToMarketItem[itemId].onSale = false;
        idToMarketItem[itemId].price = 0;
        emit MarketItemChanged(
            idToMarketItem[itemId].owner,
            idToMarketItem[itemId].owner,
            itemId,
            idToMarketItem[itemId].tokenId
        );
    }

    function sellMarketItem(
        uint itemId,
        address nftContract
    ) public payable nonReentrant {
        require(
            msg.value == idToMarketItem[itemId].price,
            "Amount must be equal to price"
        );
        //require(IERC20(erc20token).balanceOf(msg.sender) >= idToMarketItem[itemId].price, "Amount must be equal to price");
        require(
            msg.sender != idToMarketItem[itemId].owner,
            "Owner shouldn't buy their NFTs"
        );

        IERC721Upgradeable(nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            idToMarketItem[itemId].tokenId
        );
        idToMarketItem[itemId].owner.transfer(msg.value);
        if (idToMarketItem[itemId].owner == owner()) {
            totalEarnedAmounts = totalEarnedAmounts + msg.value;
        }
        //IERC20(erc20token).transferFrom(msg.sender, address(this),idToMarketItem[itemId].price);
        //IERC20(erc20token).transfer(idToMarketItem[itemId].owner,idToMarketItem[itemId].price);
        idToMarketItem[itemId].prevOwners.push(idToMarketItem[itemId].owner);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].lastPrice = idToMarketItem[itemId].price;
        idToMarketItem[itemId].price = 0;
        idToMarketItem[itemId].onSale = false;
        emit MarketItemChanged(
            idToMarketItem[itemId].owner,
            msg.sender,
            itemId,
            idToMarketItem[itemId].tokenId
        );
    }

    function fetchAllItemsOnSale(
        address _nftAddr
    ) public view returns (MarketItem[] memory) {
        uint itemsCount = _itemIds.current();
        uint onSaleItems = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].onSale == true &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                onSaleItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](onSaleItems);
        uint index = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].onSale == true &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                MarketItem storage currentItem = idToMarketItem[i + 1];
                marketItems[index] = currentItem;
                index++;
            }
        }

        return marketItems;
    }

    function fetchAllItemsOnSaleOfNotOwner(
        address _owner,
        address _nftAddr
    ) public view returns (MarketItem[] memory) {
        uint itemsCount = _itemIds.current();
        uint onSaleItems = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].onSale == true &&
                idToMarketItem[i + 1].owner != _owner &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                onSaleItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](onSaleItems);
        uint index = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].onSale == true &&
                idToMarketItem[i + 1].owner != _owner &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                MarketItem storage currentItem = idToMarketItem[i + 1];
                marketItems[index] = currentItem;
                index++;
            }
        }

        return marketItems;
    }

    function fetchAllItemsOnUseOfOwner(
        address _owner,
        address _nftAddr
    ) public view returns (MarketItem[] memory) {
        uint itemsCount = _itemIds.current();
        uint ownedItems = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].owner == _owner &&
                !idToMarketItem[i + 1].onSale &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                ownedItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](ownedItems);
        uint index = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].owner == _owner &&
                !idToMarketItem[i + 1].onSale &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                MarketItem storage currentItem = idToMarketItem[i + 1];
                marketItems[index] = currentItem;
                index++;
            }
        }

        return marketItems;
    }

    function fetchAllItemsOnSaleOfOwner(
        address _owner,
        address _nftAddr
    ) public view returns (MarketItem[] memory) {
        uint itemsCount = _itemIds.current();
        uint ownedItems = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].owner == _owner &&
                idToMarketItem[i + 1].onSale &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                ownedItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](ownedItems);
        uint index = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].owner == _owner &&
                idToMarketItem[i + 1].onSale &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                MarketItem storage currentItem = idToMarketItem[i + 1];
                marketItems[index] = currentItem;
                index++;
            }
        }
        return marketItems;
    }

    function fetchAllItemsOfOwner(
        address _owner,
        address _nftAddr
    ) public view returns (MarketItem[] memory) {
        uint itemsCount = _itemIds.current();
        uint ownedItems = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].owner == _owner &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                ownedItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](ownedItems);
        uint index = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToMarketItem[i + 1].owner == _owner &&
                idToMarketItem[i + 1].nftContract == _nftAddr
            ) {
                MarketItem storage currentItem = idToMarketItem[i + 1];
                marketItems[index] = currentItem;
                index++;
            }
        }

        return marketItems;
    }

    // Add retrieve all my NFTs
    // not updated on metakeep
    function fetchAllItems() public view returns (MarketItem[] memory) {
        uint itemsCount = _itemIds.current();
        uint ownedItems = 0;
        uint index = 0;

        for (uint i = 0; i < itemsCount; i++) {
            if (idToMarketItem[i + 1].itemId != 0) {
                ownedItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](ownedItems);
        for (uint i = 0; i < itemsCount; i++) {
            if (idToMarketItem[i + 1].itemId != 0) {
                MarketItem storage currentItem = idToMarketItem[i + 1];
                marketItems[index] = currentItem;
                index++;
            }
        }

        return marketItems;
    }

    // function setAllItems(MarketItem[] memory items) public {
    //     _itemIds.reset();
    //     uint itemsCount = items.length;

    //     for(uint i = 0; i < itemsCount; i++){
    //         _itemIds.increment();
    //         uint curID = _itemIds.current();
    //         idToMarketItem[curID] = MarketItem(
    //             items[i].itemId,
    //             items[i].tokenId,
    //             items[i].nftContract,
    //             payable(items[i].owner),
    //             items[i].lastSeller,
    //             items[i].prevOwners,
    //             items[i].price,
    //             items[i].lastPrice,
    //             items[i].onSale
    //         );
    //     }
    // }

    // function addSomeItems(MarketItem[] memory items) public {
    //     uint itemsCount = items.length;

    //     for(uint i = 0; i < itemsCount; i++){
    //         _itemIds.increment();
    //         uint curID = _itemIds.current();
    //         idToMarketItem[curID] = MarketItem(
    //             items[i].itemId,
    //             items[i].tokenId,
    //             items[i].nftContract,
    //             payable(items[i].owner),
    //             items[i].lastSeller,
    //             items[i].prevOwners,
    //             items[i].price,
    //             items[i].lastPrice,
    //             items[i].onSale
    //         );
    //     }
    // }

    function fetchAllCollections()
        public
        view
        returns (CollectionItem[] memory)
    {
        uint itemsCount = _collectionIds.current();
        CollectionItem[] memory items = new CollectionItem[](itemsCount);

        for (uint i = 0; i < itemsCount; i++) {
            CollectionItem storage currentItem = collections[i + 1];
            items[i] = currentItem;
        }

        return items;
    }

    function setMarketItem(
        uint itemId,
        uint tokenId,
        address nftContract,
        address nftowner,
        address lastSeller,
        address[] memory prevOwners,
        uint price,
        uint lastPrice,
        bool onSale
    ) public {
        idToMarketItem[itemId] = MarketItem(
            itemId,
            tokenId,
            nftContract,
            payable(nftowner),
            lastSeller,
            prevOwners,
            price,
            lastPrice,
            onSale
        );
    }

    function addMarketItem(
        uint itemId1,
        uint tokenId,
        address nftContract,
        address nftowner,
        address lastSeller,
        address[] memory prevOwners,
        uint price,
        uint lastPrice,
        bool onSale
    ) public {
        _itemIds.increment();
        uint itemId = _itemIds.current();
        idToMarketItem[itemId] = MarketItem(
            itemId,
            tokenId,
            nftContract,
            payable(nftowner),
            lastSeller,
            prevOwners,
            price,
            lastPrice,
            onSale
        );
    }

    function setTokenID(uint256 newItemId) public {
        _itemIds.reset();
        for (uint i = 0; i < newItemId; i++) {
            _itemIds.increment();
        }
    }

    function setNFTOwner(uint256[] memory _ids, address _owner) public {
        for (uint256 i = 0; i < _ids.length; i++) {
            idToMarketItem[_ids[i]].owner = payable(_owner);
        }
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        operator;
        from;
        tokenId;
        data;
        return 0x150b7a02;
    }

    function withdrawAll()
        public
        payable
        onlyMetaKeepLambdaOwner
        returns (bool)
    {
        payable(owner()).transfer(address(this).balance);
        return true;
    }
}
