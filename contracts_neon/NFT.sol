//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "metakeep-lambda/ethereum/contracts/MetaKeepLambdaUpgradeable.sol";

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

contract NFT is
    MetaKeepLambdaUpgradeable,
    ERC721URIStorageUpgradeable,
    UUPSUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    event MarketItemChanged(
        address _from,
        address to,
        uint256 ItemID,
        uint256 TokenID
    );
    CountersUpgradeable.Counter private _tokenIds;
    // CountersUpgradeable.Counter private _propertyIds;
    address private marketplaceAddress;
    string public defaultTokenURI;

    // struct Property {
    //     uint256 id;
    //     string field;
    //     string field_type;
    // }
    // mapping(uint256 => Property) public properties;

    event TokenUriUpdated(address owner, uint256 tokenID, string tokenURI);

    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address deployedMarketplaceAddress,
        address lambdaOwner,
        string memory lambdaName
    ) {
        initialize(
            _name,
            _symbol,
            deployedMarketplaceAddress,
            lambdaOwner,
            lambdaName
        );
    }

    function initialize(
        string memory _name,
        string memory _symbol,
        address deployedMarketplaceAddress,
        address lambdaOwner,
        string memory lambdaName
    ) public initializer {
        // __ERC721_init('EskillzNFT','ESKNFT');
        __ERC721_init(_name, _symbol);
        marketplaceAddress = deployedMarketplaceAddress;

        ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
        // __Ownable_init();
        _MetaKeepLambda_init(lambdaOwner, lambdaName);
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(
        address
    ) internal override onlyMetaKeepLambdaOwner {}

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function totalNFTs() public view returns (uint256) {
        return _tokenIds.current();
    }

    function setDefaultTokenUri(
        string memory _tokenURI
    ) public onlyMetaKeepLambdaOwner {
        defaultTokenURI = _tokenURI;
    }

    // function createToken(string memory tokenURI) public {
    //     _tokenIds.increment();
    //     uint newItemId = _tokenIds.current();
    //     _mint(_msgSender(), newItemId);
    //     _setTokenURI(newItemId, tokenURI);
    //     approve(marketplaceAddress, newItemId);
    //     INFTMarket(marketplaceAddress).createMarketItemFromNFTContract(newItemId, _msgSender());
    // }

    function createDefaultToken() public {
        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(_msgSender(), newItemId);
        _setTokenURI(newItemId, defaultTokenURI);
        approve(marketplaceAddress, newItemId);
        INFTMarket(marketplaceAddress).createMarketItemFromNFTContract(
            newItemId,
            _msgSender()
        );
    }

    function createTokens(string memory _tokenURI, uint Noftokens) public {
        require(Noftokens < 101, "Too high number"); //let's try a limit of 100

        for (uint i = 0; i < Noftokens; i++) {
            _tokenIds.increment();
            uint newItemId = _tokenIds.current();
            _mint(_msgSender(), newItemId);
            _setTokenURI(newItemId, _tokenURI);
            approve(marketplaceAddress, newItemId);
            INFTMarket(marketplaceAddress).createMarketItemFromNFTContract(
                newItemId,
                _msgSender()
            );
        }
    }

    function createTokensForUser(
        string memory _tokenURI,
        uint Noftokens,
        address user
    ) public {
        require(Noftokens < 101, "Too high number"); //let's try a limit of 100

        for (uint i = 0; i < Noftokens; i++) {
            _tokenIds.increment();
            uint newItemId = _tokenIds.current();
            _mint(user, newItemId);
            _setTokenURI(newItemId, _tokenURI);
            //approve(marketplaceAddress, newItemId);
            INFTMarket(marketplaceAddress).createMarketItemFromNFTContract(
                newItemId,
                user
            );
        }
    }

    function approveAndListOnsSale(
        uint itemId,
        uint price,
        uint tokenId
    ) public payable {
        require(
            msg.value >= INFTMarket(marketplaceAddress).getListingPrice(),
            "Amount doesn't meet listing fees requirements (.0025eth)"
        );
        //approve(marketplaceAddress, tokenId);
        require(
            INFTMarket(marketplaceAddress).getIdToMarketItemOwner(itemId) ==
                _msgSender() &&
                INFTMarket(marketplaceAddress).getIdToMarketItemTokenID(
                    itemId
                ) ==
                tokenId,
            "only owner can put this item on sale"
        );
        //require(msg.value == listingPrice, "Amount doesn't meet listing fees requirements (.0025eth)");
        //payable(marketplaceAddress).transfer(msg.value);
        safeTransferFrom(_msgSender(), marketplaceAddress, tokenId);
        (bool success, ) = payable(INFTMarket(marketplaceAddress).owner()).call{value: msg.value}("");
        require(success, "ERROR in tranfer");
       // payable(INFTMarket(marketplaceAddress).owner()).transfer(msg.value);
        INFTMarket(marketplaceAddress).calcEarnedFeeAmounts(msg.value);
        INFTMarket(marketplaceAddress).listItemOnSaleFromNFTContract(
            itemId,
            price,
            _msgSender()
        );
        emit MarketItemChanged(
            _msgSender(),
            marketplaceAddress,
            itemId,
            tokenId
        );
    }

    function approveAndListOnsSaleAll(
        uint[] memory itemId,
        uint price,
        uint[] memory tokenId
    ) public payable {
        require(
            msg.value >=
                INFTMarket(marketplaceAddress).getListingPrice() *
                    itemId.length,
            "Amount must be bigger than listing fees (.0025eth * numbers)"
        );
        for (uint i = 0; i < itemId.length; i++) {
            //approve(marketplaceAddress, tokenId);
            require(
                INFTMarket(marketplaceAddress).getIdToMarketItemOwner(
                    itemId[i]
                ) ==
                    _msgSender() &&
                    INFTMarket(marketplaceAddress).getIdToMarketItemTokenID(
                        itemId[i]
                    ) ==
                    tokenId[i],
                "only owner can put this item on sale"
            );
            //require(msg.value == listingPrice, "Amount doesn't meet listing fees requirements (.0025eth)");
            //payable(marketplaceAddress).transfer(msg.value);
            safeTransferFrom(_msgSender(), marketplaceAddress, tokenId[i]);
            (bool success, ) = payable(INFTMarket(marketplaceAddress).owner()).call{value: msg.value}("");
            require(success, "ERROR in tranfer");
            //payable(INFTMarket(marketplaceAddress).owner()).transfer(msg.value);
            INFTMarket(marketplaceAddress).calcEarnedFeeAmounts(msg.value);
            INFTMarket(marketplaceAddress).listItemOnSaleFromNFTContract(
                itemId[i],
                price,
                _msgSender()
            );
            emit MarketItemChanged(
                _msgSender(),
                marketplaceAddress,
                itemId[i],
                tokenId[i]
            );
        }
    }

    function deleteNFT(uint itemId, uint tokenId) public {
        require(
            ownerOf(tokenId) == _msgSender() &&
                INFTMarket(marketplaceAddress).getIdToMarketItemOwner(itemId) ==
                _msgSender() &&
                INFTMarket(marketplaceAddress).getIdToMarketItemTokenID(
                    itemId
                ) ==
                tokenId,
            "only owner can delete this item"
        );
        INFTMarket(marketplaceAddress).deleteMarketItem(itemId);
        _burn(tokenId);
        emit MarketItemChanged(_msgSender(), address(0), itemId, tokenId);
    }

    function setMarketAddress(
        address _marketplaceAddress
    ) external onlyMetaKeepLambdaOwner {
        marketplaceAddress = _marketplaceAddress;
    }

    function updateTokenUri(
        address token_owner,
        uint tokenId,
        string memory _tokenURI
    ) public {
        require(
            token_owner == ownerOf(tokenId),
            "Message sender is not owner of token. Only owner can update the URI of token."
        );
        _setTokenURI(tokenId, _tokenURI);
        emit TokenUriUpdated(token_owner, tokenId, _tokenURI);
    }
}
