//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "metakeep-lambda/ethereum/contracts/MetaKeepLambda.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";

interface IBet {
    function CreateMPGameForNFT(address _sender, uint256 amount) external;

    function JoinMPGameForNFT(
        address _sender,
        uint256 gameID,
        uint256 amount
    ) external;

    function SetMPGameResultForNFT(address winner, uint256 GameID) external;

    function getGameID() external view returns (uint256);
}

interface INFTMarket {
    function setNFTOwner(uint256[] memory _ids, address _owner) external;
}

interface ISport {
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function mintMore(
        address _toAddress,
        uint256 amount
    ) external returns (bool);
}

contract NFTBet is MetaKeepLambda, IERC721ReceiverUpgradeable {
    using SafeMath for uint256;

    address owner;

    address public BetAddress;
    address public SportAddress;
    address public MarketAddress;
    struct Bet {
        address player;
        uint256 amount;
        uint256 gameType; // sp 0, mp 1
        uint256 betType; // sport 0, other 1, nft 2
        uint256[] nftids;
        address[] nftcontracts;
        uint256[] nftmarketids;
    }

    mapping(uint256 => Bet[]) public gamebetting;

    constructor(
        address _sport,
        address _bet,
        address _market,
        address lambdaOwner,
        string memory lambdaName
    ) MetaKeepLambda(lambdaOwner, lambdaName) {
        owner = lambdaOwner;

        BetAddress = _bet;
        SportAddress = _sport;
        MarketAddress = _market;
    }

    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }

    function CreateMPGameForNFT(
        address _sender,
        uint256 amount,
        address prizeAddr,
        uint256[] memory nftIDs,
        address[] memory nftContracts,
        uint256[] memory nftMarketIDs
    ) external {
        ISport(SportAddress).transferFrom(_sender, prizeAddr, amount);

        IBet(BetAddress).CreateMPGameForNFT(_sender, amount);
        uint256 curGameID = IBet(BetAddress).getGameID();
        for (uint i = 0; i < nftIDs.length; i++) {
            IERC721Upgradeable(nftContracts[i]).safeTransferFrom(
                _sender,
                address(this),
                nftIDs[i]
            );
        }
        gamebetting[curGameID].push(
            Bet(_sender, amount, 1, 2, nftIDs, nftContracts, nftMarketIDs)
        );
    }

    function JoinMPGameForNFT(
        address _sender,
        uint256 gameID,
        uint256 amount,
        address prizeAddr,
        uint256[] memory nftIDs,
        address[] memory nftContracts,
        uint256[] memory nftMarketIDs
    ) external {
        ISport(SportAddress).transferFrom(_sender, prizeAddr, amount);

        IBet(BetAddress).JoinMPGameForNFT(_sender, gameID, amount);
        for (uint i = 0; i < nftIDs.length; i++) {
            IERC721Upgradeable(nftContracts[i]).safeTransferFrom(
                _sender,
                address(this),
                nftIDs[i]
            );
        }
        gamebetting[gameID].push(
            Bet(_sender, amount, 1, 2, nftIDs, nftContracts, nftMarketIDs)
        );
    }

    function SetMPGameResultForNFT(address winner, uint256 GameID) external {
        IBet(BetAddress).SetMPGameResultForNFT(winner, GameID);

        for (uint i = 0; i < gamebetting[GameID][0].nftids.length; i++) {
            IERC721Upgradeable(gamebetting[GameID][0].nftcontracts[i])
                .safeTransferFrom(
                    address(this),
                    winner,
                    gamebetting[GameID][0].nftids[i]
                );
        }
        for (uint i = 0; i < gamebetting[GameID][1].nftids.length; i++) {
            IERC721Upgradeable(gamebetting[GameID][1].nftcontracts[i])
                .safeTransferFrom(
                    address(this),
                    winner,
                    gamebetting[GameID][1].nftids[i]
                );
        }

        INFTMarket(MarketAddress).setNFTOwner(
            gamebetting[GameID][0].nftmarketids,
            winner
        );
        INFTMarket(MarketAddress).setNFTOwner(
            gamebetting[GameID][1].nftmarketids,
            winner
        );

        delete (gamebetting[GameID]);
    }

    function setBetAddress(address _betaddress) external {
        BetAddress = _betaddress;
    }

    function setSportAddress(address _sport) external {
        SportAddress = _sport;
    }

    function setMarketAddress(address _addr) external {
        MarketAddress = _addr;
    }

    function getGameInfo(uint256 gameID) external view returns (Bet[] memory) {
        return gamebetting[gameID];
    }

    function getPlayerLength(uint256 game) external view returns (uint256) {
        return gamebetting[game].length;
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
}
