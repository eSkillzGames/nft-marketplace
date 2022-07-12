//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./MarketPlace_card.sol";

contract NFTCard is Initializable, ERC721URIStorageUpgradeable, UUPSUpgradeable, OwnableUpgradeable{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    event MarketItemChanged(address _from, address to, uint256 ItemID, uint256 TokenID);
    CountersUpgradeable.Counter private _tokenIds;
    address private marketplaceAddress;
    string public defaultTokenURI;
    NFTMarket_Card public nFTMarket;
    
    function initialize(address deployedMarketplaceAddress, NFTMarket_Card _nFTMarket)  public initializer {
        
        __ERC721_init('EskillzCard','ESKCARD');
        marketplaceAddress = deployedMarketplaceAddress;
        nFTMarket = _nFTMarket;

        ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
        __Ownable_init();
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function totalNFTs() public view returns(uint256){
        return _tokenIds.current();
    }

    function setDefaultTokenUri(string memory tokenURI) public onlyOwner{
       defaultTokenURI = tokenURI;
    }

    function createToken(string memory tokenURI) public {
        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        approve(marketplaceAddress, newItemId);
        nFTMarket.createMarketItemFromNFTContract(newItemId, msg.sender);
    }

    function createDefaultToken() public {
        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, defaultTokenURI);
        approve(marketplaceAddress, newItemId);
        nFTMarket.createMarketItemFromNFTContract(newItemId, msg.sender);
    }

    function createTokens(string memory tokenURI, uint Noftokens) public {
        require(Noftokens < 101,'Too high number'); //let's try a limit of 100
        
        for (uint i=0;i<Noftokens;i++){         
            _tokenIds.increment();
            uint newItemId = _tokenIds.current();
            _mint(msg.sender, newItemId);
            _setTokenURI(newItemId, tokenURI);
            approve(marketplaceAddress, newItemId);  
            nFTMarket.createMarketItemFromNFTContract(newItemId, msg.sender);      
        }    
	}

    function createTokensForUser(string memory tokenURI, uint Noftokens, address user) public {
        require(Noftokens < 101,'Too high number'); //let's try a limit of 100
        
        for (uint i=0;i<Noftokens;i++){         
            _tokenIds.increment();
            uint newItemId = _tokenIds.current();
            _mint(user, newItemId);
            _setTokenURI(newItemId, tokenURI);
            //approve(marketplaceAddress, newItemId);  
            nFTMarket.createMarketItemFromNFTContract(newItemId, user);      
        }    
	}
    
    function approveAndListOnsSale(uint itemId, uint price, uint tokenId) public payable {
        require(msg.value >= nFTMarket.getListingPrice(), "Amount doesn't meet listing fees requirements (.0025eth)");
        //approve(marketplaceAddress, tokenId);        
        require(nFTMarket.getIdToMarketItemOwner(itemId) == msg.sender && nFTMarket.getIdToMarketItemTokenID(itemId) == tokenId, 'only owner can put this item on sale');
        //require(msg.value == listingPrice, "Amount doesn't meet listing fees requirements (.0025eth)");
        //payable(marketplaceAddress).transfer(msg.value);
        safeTransferFrom(msg.sender, marketplaceAddress, tokenId);
        payable(nFTMarket.owner()).transfer(msg.value);
        nFTMarket.calcEarnedFeeAmounts(msg.value);
        nFTMarket.listItemOnSaleFromNFTContract(itemId, price, msg.sender);
        emit MarketItemChanged(msg.sender, marketplaceAddress, itemId, tokenId);
    }

    function deleteNFT(uint itemId, uint tokenId) public {
               
        require(ownerOf(tokenId) == msg.sender && nFTMarket.getIdToMarketItemOwner(itemId) == msg.sender && nFTMarket.getIdToMarketItemTokenID(itemId) == tokenId, 'only owner can delete this item');
        nFTMarket.deleteMarketItem(itemId);
        _burn(tokenId);   
        emit MarketItemChanged(msg.sender, address(0), itemId, tokenId);     
    }

    function updateTokenUri(uint tokenId, string memory tokenURI) public {
        require(msg.sender == ownerOf(tokenId), "Message sender is not owner of token. Only owner can update the URI of token.");
        _setTokenURI(tokenId, tokenURI);    

    }
}