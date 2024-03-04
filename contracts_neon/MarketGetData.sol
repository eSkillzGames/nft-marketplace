//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "metakeep-lambda/ethereum/contracts/MetaKeepLambda.sol";

interface INFTMarket {
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
    function fetchAllItems() external view returns(MarketItem[] memory);
    function fetchAllItemsOnSale(address _nftAddr) external view returns(MarketItem[] memory);
    function fetchAllItemsOnSaleOfNotOwner(address _owner, address _nftAddr) external view returns(MarketItem[] memory);
    function fetchAllItemsOnUseOfOwner(address _owner, address _nftAddr) external view returns(MarketItem[] memory);
    function fetchAllItemsOnSaleOfOwner(address _owner, address _nftAddr) external view returns(MarketItem[] memory);
    function fetchAllItemsOfOwner(address _owner, address _nftAddr) external view returns(MarketItem[] memory);
}

contract MarketGetData is MetaKeepLambda {
    address MarketplaceAddress;

    constructor (address marketplace, address lambdaOwner, string memory lambdaName) MetaKeepLambda(lambdaOwner, lambdaName) {
        MarketplaceAddress = marketplace;
    }

    function fetchAllItemsOnSale(address _nftAddr, uint256 page, uint256 pageSize) public view returns(INFTMarket.MarketItem[] memory, uint256){       
        INFTMarket.MarketItem[] memory marketItems = INFTMarket(MarketplaceAddress).fetchAllItemsOnSale(_nftAddr);

        uint onSaleItems = marketItems.length;
        require(pageSize > 0, "page size must be positive");
        require(page == 0 || page*pageSize <= onSaleItems, "out of bounds");
        
        uint256 actualSize = pageSize;
        if ((page+1)*pageSize > onSaleItems) {
            actualSize = onSaleItems - page*pageSize;
        }
        
        INFTMarket.MarketItem[] memory marketItemsPage = new INFTMarket.MarketItem[](actualSize);
        for(uint i = 0; i < actualSize; i++){
            marketItemsPage[i] = marketItems[page*pageSize + i];
        }
    
        return (marketItemsPage, onSaleItems);
    }

    function fetchAllItemsOnSaleOfNotOwner(address _owner, address _nftAddr, uint256 page, uint256 pageSize) public view returns(INFTMarket.MarketItem[] memory, uint256){
        INFTMarket.MarketItem[] memory marketItems = INFTMarket(MarketplaceAddress).fetchAllItemsOnSaleOfNotOwner(_owner, _nftAddr);
        uint256 onSaleItems = marketItems.length;
        
        require(pageSize > 0, "page size must be positive");
        require(page == 0 || page*pageSize <= onSaleItems, "out of bounds");
        
        uint256 actualSize = pageSize;
        if ((page+1)*pageSize > onSaleItems) {
            actualSize = onSaleItems - page*pageSize;
        }
        
        INFTMarket.MarketItem[] memory marketItemsPage = new INFTMarket.MarketItem[](actualSize);
        for(uint i = 0; i < actualSize; i++){
            marketItemsPage[i] = marketItems[page*pageSize + i];
        }
    
        return (marketItemsPage, onSaleItems);
    }

    function fetchAllItemsOnUseOfOwner(address _owner, address _nftAddr, uint256 page, uint256 pageSize) public view returns(INFTMarket.MarketItem[] memory, uint256){
        INFTMarket.MarketItem[] memory marketItems = INFTMarket(MarketplaceAddress).fetchAllItemsOnUseOfOwner(_owner, _nftAddr);
        uint ownedItems = marketItems.length;
                
        require(pageSize > 0, "page size must be positive");
        require(page == 0 || page*pageSize <= ownedItems, "out of bounds");
        
        uint256 actualSize = pageSize;
        if ((page+1)*pageSize > ownedItems) {
            actualSize = ownedItems - page*pageSize;
        }
        
        INFTMarket.MarketItem[] memory marketItemsPage = new INFTMarket.MarketItem[](actualSize);
        for(uint i = 0; i < actualSize; i++){
            marketItemsPage[i] = marketItems[page*pageSize + i];
        }
    
        return (marketItemsPage, ownedItems);
    }

    function fetchAllItemsOnSaleOfOwner(address _owner, address _nftAddr, uint256 page, uint256 pageSize) public view returns(INFTMarket.MarketItem[] memory, uint256){
        INFTMarket.MarketItem[] memory marketItems = INFTMarket(MarketplaceAddress).fetchAllItemsOnSaleOfOwner(_owner, _nftAddr);
        uint ownedItems = marketItems.length;
        
        require(pageSize > 0, "page size must be positive");
        require(page == 0 || page*pageSize <= ownedItems, "out of bounds");
        
        uint256 actualSize = pageSize;
        if ((page+1)*pageSize > ownedItems) {
            actualSize = ownedItems - page*pageSize;
        }
        
        INFTMarket.MarketItem[] memory marketItemsPage = new INFTMarket.MarketItem[](actualSize);
        for(uint i = 0; i < actualSize; i++){
            marketItemsPage[i] = marketItems[page*pageSize + i];
        }
    
        return (marketItemsPage, ownedItems);
    }

    function fetchAllItemsOfOwner(address _owner, address _nftAddr, uint256 page, uint256 pageSize) public view returns(INFTMarket.MarketItem[] memory, uint256){
        INFTMarket.MarketItem[] memory marketItems = INFTMarket(MarketplaceAddress).fetchAllItemsOfOwner(_owner, _nftAddr);
        uint ownedItems = marketItems.length;

        require(pageSize > 0, "page size must be positive");
        require(page == 0 || page*pageSize <= ownedItems, "out of bounds");
        
        uint256 actualSize = pageSize;
        if ((page+1)*pageSize > ownedItems) {
            actualSize = ownedItems - page*pageSize;
        }
        
        INFTMarket.MarketItem[] memory marketItemsPage = new INFTMarket.MarketItem[](actualSize);
        for(uint i = 0; i < actualSize; i++){
            marketItemsPage[i] = marketItems[page*pageSize + i];
        }
    
        return (marketItemsPage, ownedItems);
    }

    function fetchAllItems(address _nftAddr, uint page, uint pageSize) public view returns(INFTMarket.MarketItem[] memory, uint256){
        INFTMarket.MarketItem[] memory marketItems = INFTMarket(MarketplaceAddress).fetchAllItems();

        uint ownedItems = 0;
        for(uint i = 0; i < marketItems.length; i++){
            if(marketItems[i].itemId != 0 && marketItems[i].nftContract == _nftAddr){
                ownedItems++;
            }
        }
        
        uint index = 0;
        INFTMarket.MarketItem[] memory fMarketItems = new INFTMarket.MarketItem[](ownedItems);
        for(uint i = 0; i<marketItems.length; i++){
            if(marketItems[i].itemId != 0 && marketItems[i].nftContract == _nftAddr){
                fMarketItems[index] = marketItems[i];
                index++;
            }
        }

        require(pageSize > 0, "page size must be positive");
        require(page == 0 || page*pageSize <= ownedItems, "out of bounds");
        
        uint256 actualSize = pageSize;
        if ((page+1)*pageSize > ownedItems) {
            actualSize = ownedItems - page*pageSize;
        }
        
        INFTMarket.MarketItem[] memory marketItemsPage = new INFTMarket.MarketItem[](actualSize);
        for(uint i = 0; i < actualSize; i++){
            marketItemsPage[i] = fMarketItems[page*pageSize + i];
        }

        return (marketItemsPage, ownedItems);
    }

}