//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract NFTMarket is Initializable , ReentrancyGuardUpgradeable, IERC721ReceiverUpgradeable, UUPSUpgradeable, OwnableUpgradeable{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    event MarketItemChanged(address _from, address to, uint256 ItemID, uint256 TokenID);
    CountersUpgradeable.Counter private _itemIds;
    address public erc20token;
    uint256 listingPrice;
    uint256 public totalEarnedAmounts;
    uint256 public totalEarnedFeeAmounts;
    address public NFTContract;
        
    function initialize(address _erec20Token) public initializer {
        
        listingPrice = 0.0025 ether;
        erc20token = _erec20Token;

        ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
        __Ownable_init();
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    struct MarketItem{
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

    mapping(uint256 => MarketItem) private idToMarketItem;

    function getListingPrice() public view returns(uint256){
        return listingPrice;
    }   

    function getIdToMarketItemOwner(uint itemId) public view returns(address){
        return idToMarketItem[itemId].owner;
    }

    function getIdToMarketItemTokenID(uint itemId) public view returns(uint){
        return idToMarketItem[itemId].tokenId;
    }

    function setERC20Token(address _TokenAdddress) public onlyOwner{
        erc20token = _TokenAdddress;
    }

    function setNFTContract(address _NFTAddress) public onlyOwner{
        NFTContract = _NFTAddress;
    }

    function calcEarnedFeeAmounts(uint256 amount) public {
        require(NFTContract == msg.sender, 'Only NFT Contract can list new Items');
        totalEarnedFeeAmounts = totalEarnedFeeAmounts + amount;
    }

    function createMarketItemFromNFTContract(
        uint256 tokenId,
        address _owner
    ) public {
        require(NFTContract == msg.sender, 'Only NFT Contract can list new Items');
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
    ) public returns(uint256){
        require(IERC721Upgradeable(nftContract).ownerOf(tokenId) == msg.sender, 'Only owner can list new Items');
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
        for(uint i = 0; i < tokenIds.length; i++){
            require(IERC721Upgradeable(nftContract).ownerOf(tokenIds[i]) == msg.sender, 'Only owner can list new Items');
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

    function deleteMarketItem(
        uint256 itemId
    ) public {
        require(NFTContract == msg.sender, 'Only NFT contract can delete Item');
        delete idToMarketItem[itemId];
    }

    function listItemOnSaleFromNFTContract(
        uint itemId,
        uint price,
        address _owner
        ) public payable{
                
        idToMarketItem[itemId].onSale = true;
        idToMarketItem[itemId].lastSeller = _owner;
        idToMarketItem[itemId].price = price;  
    }
    
    function listItemOnSale(
        uint itemId,
        address nftContract,
        uint price
        ) public payable{
        
        require(idToMarketItem[itemId].owner == msg.sender, 'only owner can put this item on sale');
        require(msg.value == listingPrice, "Amount doesn't meet listing fees requirements (.0025eth)");
        
        IERC721Upgradeable(nftContract).safeTransferFrom(msg.sender, address(this), idToMarketItem[itemId].tokenId);
        payable(owner()).transfer(msg.value);
        
        idToMarketItem[itemId].onSale = true;
        idToMarketItem[itemId].lastSeller = msg.sender;
        idToMarketItem[itemId].price = price;  
    }

    function listItemCancelOnSale(
        uint itemId,
        address nftContract
        ) public payable{
        
        require(idToMarketItem[itemId].owner == msg.sender && idToMarketItem[itemId].onSale, 'only owner can cancel this item on sale');
        IERC721Upgradeable(nftContract).safeTransferFrom(address(this), msg.sender, idToMarketItem[itemId].tokenId);
        idToMarketItem[itemId].onSale = false;
        idToMarketItem[itemId].price = 0; 
        emit MarketItemChanged(idToMarketItem[itemId].owner, idToMarketItem[itemId].owner, itemId, idToMarketItem[itemId].tokenId); 
    }
    
    function sellMarketItem(
        uint itemId,
        address nftContract
        ) public payable nonReentrant{
            /*
            //require(msg.value == idToMarketItem[itemId].price, "Amount must be equal to price");
            require(IERC20(erc20token).balanceOf(msg.sender) >= idToMarketItem[itemId].price, "Amount must be equal to price");
            require(msg.sender != idToMarketItem[itemId].owner, "Owner shouldn't buy their NFTs");
            
            IERC721(nftContract).safeTransferFrom(address(this), msg.sender, idToMarketItem[itemId].tokenId);
            //idToMarketItem[itemId].owner.transfer(msg.value);
            //IERC20(erc20token).transferFrom(msg.sender, address(this),idToMarketItem[itemId].price);
            //IERC20(erc20token).transfer(idToMarketItem[itemId].owner,idToMarketItem[itemId].price);
            IERC20(erc20token).transferFrom(msg.sender, idToMarketItem[itemId].owner, idToMarketItem[itemId].price);
            idToMarketItem[itemId].prevOwners.push(idToMarketItem[itemId].owner) ;
            idToMarketItem[itemId].owner = payable(msg.sender);
            idToMarketItem[itemId].lastPrice = idToMarketItem[itemId].price;
            idToMarketItem[itemId].price = 0;
            idToMarketItem[itemId].onSale = false;
            */
            
            require(msg.value == idToMarketItem[itemId].price, "Amount must be equal to price");
            //require(IERC20(erc20token).balanceOf(msg.sender) >= idToMarketItem[itemId].price, "Amount must be equal to price");
            require(msg.sender != idToMarketItem[itemId].owner, "Owner shouldn't buy their NFTs");
            
            IERC721Upgradeable(nftContract).safeTransferFrom(address(this), msg.sender, idToMarketItem[itemId].tokenId);
            idToMarketItem[itemId].owner.transfer(msg.value);
            if(idToMarketItem[itemId].owner == owner()){
                totalEarnedAmounts = totalEarnedAmounts + msg.value;
            }
            //IERC20(erc20token).transferFrom(msg.sender, address(this),idToMarketItem[itemId].price);
            //IERC20(erc20token).transfer(idToMarketItem[itemId].owner,idToMarketItem[itemId].price);
            idToMarketItem[itemId].prevOwners.push(idToMarketItem[itemId].owner) ;
            idToMarketItem[itemId].owner = payable(msg.sender);
            idToMarketItem[itemId].lastPrice = idToMarketItem[itemId].price;
            idToMarketItem[itemId].price = 0;
            idToMarketItem[itemId].onSale = false;
            emit MarketItemChanged(idToMarketItem[itemId].owner, msg.sender, itemId, idToMarketItem[itemId].tokenId);
        }
    
    
    function fetchAllItemsOnSale() public view returns(MarketItem[] memory){
        uint itemsCount = _itemIds.current();
        uint onSaleItems = 0;

        for(uint i = 0; i < itemsCount; i++){
            if(idToMarketItem[i+1].onSale == true){
                onSaleItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](onSaleItems);
        uint index = 0;
        
        for(uint i = 0; i<itemsCount; i++){
            if(idToMarketItem[i+1].onSale == true){
                MarketItem storage currentItem = idToMarketItem[i+1];
                marketItems[index] = currentItem;
                index++;
            }
        }
        
        return marketItems;
    }

    function fetchAllItemsOnSaleOfNotOwner(address owner) public view returns(MarketItem[] memory){
        uint itemsCount = _itemIds.current();
        uint onSaleItems = 0;

        for(uint i = 0; i < itemsCount; i++){
            if(idToMarketItem[i+1].onSale == true && idToMarketItem[i+1].owner != owner){
                onSaleItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](onSaleItems);
        uint index = 0;
        
        for(uint i = 0; i<itemsCount; i++){
            if(idToMarketItem[i+1].onSale == true && idToMarketItem[i+1].owner != owner){
                MarketItem storage currentItem = idToMarketItem[i+1];
                marketItems[index] = currentItem;
                index++;
            }
        }
        
        return marketItems;
    }

    function fetchAllItemsOnUseOfOwner(address owner) public view returns(MarketItem[] memory){
        uint itemsCount = _itemIds.current();
        uint ownedItems = 0;

        for(uint i = 0; i < itemsCount; i++){
            if(idToMarketItem[i+1].owner == owner && !idToMarketItem[i+1].onSale){
                ownedItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](ownedItems);
        uint index = 0;
        
        for(uint i = 0; i<itemsCount; i++){
            if(idToMarketItem[i+1].owner == owner && !idToMarketItem[i+1].onSale){
                MarketItem storage currentItem = idToMarketItem[i+1];
                marketItems[index] = currentItem;
                index++;
            }
        }
        
        return marketItems; 
    }

    function fetchAllItemsOnSaleOfOwner(address owner) public view returns(MarketItem[] memory){
        uint itemsCount = _itemIds.current();
        uint ownedItems = 0;

        for(uint i = 0; i < itemsCount; i++){
            if(idToMarketItem[i+1].owner == owner && idToMarketItem[i+1].onSale){
                ownedItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](ownedItems);
        uint index = 0;
        
        for(uint i = 0; i<itemsCount; i++){
            if(idToMarketItem[i+1].owner == owner && idToMarketItem[i+1].onSale){
                MarketItem storage currentItem = idToMarketItem[i+1];
                marketItems[index] = currentItem;
                index++;
            }
        }
        
        return marketItems; 
    }

    function fetchAllItemsOfOwner(address owner) public view returns(MarketItem[] memory){
        uint itemsCount = _itemIds.current();
        uint ownedItems = 0;

        for(uint i = 0; i < itemsCount; i++){
            if(idToMarketItem[i+1].owner == owner){
                ownedItems++;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](ownedItems);
        uint index = 0;
        
        for(uint i = 0; i<itemsCount; i++){
            if(idToMarketItem[i+1].owner == owner){
                MarketItem storage currentItem = idToMarketItem[i+1];
                marketItems[index] = currentItem;
                index++;
            }
        }
        
        return marketItems; 
    }
    
    // Add retrieve all my NFTs

    function fetchAllItems() public view returns(MarketItem[] memory){
        uint itemsCount = _itemIds.current();
        MarketItem[] memory marketItems = new MarketItem[](itemsCount);
        
        for(uint i = 0; i < itemsCount; i++){
            MarketItem storage currentItem = idToMarketItem[i+1];
            marketItems[i] = currentItem;
        }
    
        return marketItems;
    }
     
       function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override pure returns (bytes4){
        operator;
        from;
        tokenId;
        data;
        return 0x150b7a02;
    }

    function withdrawAll() 
        public payable 
        onlyOwner
        returns(bool) 
    {
        payable(owner()).transfer(address(this).balance);
        return true;
    }

}