//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "metakeep-lambda/ethereum/contracts/MetaKeepLambda.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface ISport {

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    function mintMore(address _toAddress, uint256 amount) external returns (bool);
}

contract BYTESBet {
    using SafeMath for uint256;

    address owner;

    uint256 public GameIDs;
    uint256 public minBetAmounts;
    address public BYTES;
    struct Bet {
        address player;
        uint256 amount;
        uint256 gameType; // sp 0, mp 1
    }
    
    mapping(uint256 => Bet[]) public gamebetting;
    //mapping(address => uint256) public staking;
    mapping(uint256 => uint256) public totalAmountsOfDay;
    uint256 public eskillz_fee;
    address public feeReceiver;
    address public treasury;
    uint256 startTimeStamp;
    event BetEvent(uint256 _game, uint256 _amount);

    modifier onlySportContract {
      require(_msgSender() == sport);
      _;
    }

    constructor (
        address _sport, address lambdaOwner, string memory lambdaName
    ) MetaKeepLambda(lambdaOwner, lambdaName) { 
        owner = lambdaOwner;

        sport = _sport;  
        eskillz_fee = 500; 
        feeReceiver = 0x099b7b28AC913efbb3236946769AC6D3819329ab;
        ISport(sport).approve(feeReceiver, 1000000000000000000);  
        minBetAmounts = 1000000000;
        startTimeStamp = block.timestamp;    
    }

    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }
   
    function  SetGameIDToZero() external onlyMetaKeepLambdaOwner{

      GameIDs = 0;

    }

    function  SetMinBetAmounts(uint256 _amounts) external onlyMetaKeepLambdaOwner{

      minBetAmounts = _amounts;

    }

    function  CreateSPGame(address _sender, uint256 amount) external onlySportContract{
      require(minBetAmounts<= amount, "Bet amounts must be bigger than minBetAmounts");
      totalAmountsOfDay[block.timestamp] +=amount;
      GameIDs++;
      ISport(sport).transferFrom(_sender, address(this), amount);
      delete(gamebetting[GameIDs]);
      gamebetting[GameIDs].push(Bet(_sender, amount, 0, 0));
      emit BetEvent(GameIDs, amount);
    }

    function CreateSPGameByToken(address _sender, uint256 amount) external {
        require(amount > 0, "Bet amounts must be bigger than zero");
        // totalAmountsOfDay[block.timestamp] += amount;
        GameIDs++;
        delete(gamebetting[GameIDs]);
        gamebetting[GameIDs].push(Bet(_sender, amount, 0, 1));
        emit BetEvent(GameIDs, amount);
    }
    
    function SetSPGameResult(address winner, uint256 GameID, uint256 result, uint256 reduction_fee) external {
        
        (uint256 amountToWinner,uint256 amountToESkillz) = getAmountsSPGameToDistribute(GameID, reduction_fee);
        require(gamebetting[GameID][0].player == winner, "Other Players can not access.");
        require(gamebetting[GameID][0].gameType == 0, "You can set the SP game only");
        require(ISport(sport).balanceOf(address(this)) >= gamebetting[GameID][0].amount, "Dport Balance of Bet contract is not enough.");
        ISport(sport).mintMore(winner, gamebetting[GameID][0].amount*result/100);
        ISport(sport).transfer(winner, amountToWinner);
        ISport(sport).transfer(feeReceiver, amountToESkillz);
        if(totalAmountsOfDay[block.timestamp] >= (gamebetting[GameID][0].amount)){

            totalAmountsOfDay[block.timestamp] -=(gamebetting[GameID][0].amount);
        }
        else{
            if((block.timestamp- startTimeStamp)/ 1 days > 0){

                totalAmountsOfDay[block.timestamp - 1] -=(gamebetting[GameID][0].amount);
            }
        }
        delete(gamebetting[GameID]);
    }
    function SetSPGameResultByToken(address winner, uint256 GameID, uint256 result, uint256 reduction_fee) external {       
        (uint256 amountToWinner,uint256 amountToESkillz) = getAmountsSPGameToDistribute(GameID, reduction_fee);
        require(gamebetting[GameID][0].player == winner, "Other Players can not access.");
        require(gamebetting[GameID][0].gameType == 0, "You can set the SP game only");
        require(gamebetting[GameID][0].betType == 1, "You can set the SP game only");
        
        ISport(sport).mintMore(winner, amountToWinner + gamebetting[GameID][0].amount*result/100);
        delete(gamebetting[GameID]);
    }

    function CreateMPGame(address _sender, uint256 amount) external onlySportContract{
        require(minBetAmounts<= amount, "Bet amounts must be bigger than minBetAmounts");
        totalAmountsOfDay[block.timestamp] += amount;
        GameIDs++;
        ISport(sport).transferFrom(_sender, address(this), amount);
        delete(gamebetting[GameIDs]);
        gamebetting[GameIDs].push(Bet(_sender, amount, 1, 0));
        emit BetEvent(GameIDs, amount);
    }

    function CreateMPGameByToken(address _sender, uint256 amount) external{
        require(amount > 0, "Bet amounts must be bigger than zero");
        // totalAmountsOfDay[block.timestamp] += sportAmount;
        GameIDs++;
        delete(gamebetting[GameIDs]);
        gamebetting[GameIDs].push(Bet(_sender, amount, 1, 1));
        emit BetEvent(GameIDs, amount);
    }    

    function CreateMPGameForNFT(address _sender, uint256 amount) external {
        GameIDs++;
        
        delete(gamebetting[GameIDs]);
        gamebetting[GameIDs].push(Bet(_sender, amount, 1, 2));
        emit BetEvent(GameIDs, amount);
    }

    function JoinMPGame(address _sender, uint256 gameID, uint256 amount) external onlySportContract{
        require(gamebetting[gameID].length == 1, "Players can not join.");
        require(gamebetting[gameID][0].player != _sender, "Same Players can not join.");
        require(amount== gamebetting[gameID][0].amount, "Your bet amount must equals create amount");
        require(gamebetting[gameID][0].gameType == 1, "You can join the MP game only");
        totalAmountsOfDay[block.timestamp] += amount;
        ISport(sport).transferFrom(_sender, address(this), amount);
        gamebetting[gameID].push(Bet(_sender, amount, 1, 0));
        emit BetEvent(gameID, amount);
    }

    function JoinMPGameByToken(address _sender, uint256 gameID, uint256 amount) external{
        require(gamebetting[gameID].length == 1, "Players can not join.");
        require(gamebetting[gameID][0].player != _sender, "Same Players can not join.");
        require(amount== gamebetting[gameID][0].amount, "Your bet amount must equals create amount");
        require(gamebetting[gameID][0].gameType == 1, "You can join the MP game only");
        // totalAmountsOfDay[block.timestamp] += sportAmount;
        // IERC20(_tokenAddr).transferFrom(_sender, treasury, amount);
        gamebetting[gameID].push(Bet(_sender, amount, 1, 1));
        emit BetEvent(gameID, amount);
    }

    function JoinMPGameForNFT(address _sender, uint256 gameID, uint256 amount) external{
        require(gamebetting[gameID].length == 1, "Players can not join.");
        require(gamebetting[gameID][0].player != _sender, "Same Players can not join.");
        require(gamebetting[gameID][0].gameType == 1, "You can join the MP game only");
                
        gamebetting[gameID].push(Bet(_sender, amount, 1, 2));
        emit BetEvent(gameID, amount);
    }

    function SetMPGameResult(address winner, uint256 GameID, uint reduction_fee) external {
        (uint256 amountToWinner,uint256 amountToESkillz) = getAmountsMPGameToDistribute(GameID, reduction_fee);
        require(gamebetting[GameID][0].gameType == 1 && gamebetting[GameID][1].gameType == 1, "You can set the MP game only");
        require(winner == gamebetting[GameID][0].player || winner == gamebetting[GameID][1].player, "msg sender must includes in this game");
        require(ISport(sport).balanceOf(address(this)) >= gamebetting[GameID][0].amount *2, "Dport Balance of Bet contract is not enough.");

        if(winner == gamebetting[GameID][0].player) {
            ISport(sport).transfer(gamebetting[GameID][0].player, amountToWinner);
           
        } else {
            ISport(sport).transfer(gamebetting[GameID][1].player, amountToWinner);
            
        }  
        ISport(sport).transfer(feeReceiver, amountToESkillz);
        if(totalAmountsOfDay[(block.timestamp - startTimeStamp) / 1 days] >= (amountToWinner + amountToESkillz)){

            totalAmountsOfDay[(block.timestamp - startTimeStamp) / 1 days] -=(amountToWinner + amountToESkillz);
        }
        else{
            if((block.timestamp - startTimeStamp)/ 1 days > 0){

                totalAmountsOfDay[(block.timestamp - startTimeStamp) / 1 days - 1] -=(amountToWinner + amountToESkillz);
            }
        }    
        delete(gamebetting[GameID]);
    }

    function SetMPGameResultForNFT(address winner, uint256 GameID) external {
        require(gamebetting[GameID][0].gameType == 1 && gamebetting[GameID][1].gameType == 1, "You can set the MP game only");
        require(winner == gamebetting[GameID][0].player || winner == gamebetting[GameID][1].player, "msg sender must includes in this game");

        delete(gamebetting[GameID]);
    }

    function SetMPGameResultByToken(address winner, uint256 GameID, uint256 reduction_fee) external {
        (uint256 amountToWinner,uint256 amountToESkillz) = getAmountsMPGameToDistribute(GameID, reduction_fee);
        require(gamebetting[GameID][0].gameType == 1 && gamebetting[GameID][1].gameType == 1, "You can set the MP game only");
        require(winner == gamebetting[GameID][0].player || winner == gamebetting[GameID][1].player, "msg sender must includes in this game");
        require(ISport(sport).balanceOf(address(this)) >= gamebetting[GameID][0].amount *2, "Dport Balance of Bet contract is not enough.");

        if(winner == gamebetting[GameID][0].player) {
            ISport(sport).mintMore(gamebetting[GameID][0].player, amountToWinner);   
        } else {
            ISport(sport).mintMore(gamebetting[GameID][1].player, amountToWinner);            
        }    
        delete(gamebetting[GameID]);
    }

    function getAmountsSPGameToDistribute(uint256 game, uint256 reduction_fee) private view returns (uint256, uint256) {
        uint256 amountToESkillz = gamebetting[game][0].amount * (eskillz_fee - eskillz_fee * (reduction_fee / 100)) / 10000;
        uint256 amountToWinner = gamebetting[game][0].amount - amountToESkillz;
        return(amountToWinner, amountToESkillz);
    }

    function getAmountsMPGameToDistribute(uint256 game, uint256 reduction_fee) private view returns (uint256, uint256) {
        uint256 amountToESkillz = gamebetting[game][0].amount * (eskillz_fee - eskillz_fee * (reduction_fee / 100)) / 10000;
        uint256 amountToWinner = 2 * gamebetting[game][0].amount - amountToESkillz;
        return(amountToWinner, amountToESkillz);
    }   

    function getGameInfo(uint256 gameID) external view returns (Bet[] memory){
        return gamebetting[gameID];
    }

    function getGameID() external view returns (uint256) {
        return GameIDs;
    }

    function getPlayerLength(uint256 game) external view returns (uint256) {
        return gamebetting[game].length;
    }
    
    function setTresury(address _address) external onlyMetaKeepLambdaOwner {
        treasury = _address;
    }
    
    function setFeeReceiver(address _address) external onlyMetaKeepLambdaOwner {
        feeReceiver = _address;
        ISport(sport).approve(feeReceiver, 1000000000000000000);  
    }

    function setFee(uint256 _fee) external onlyMetaKeepLambdaOwner {
        eskillz_fee = _fee;
    }

    function setSportAddress(address _sport) external onlyMetaKeepLambdaOwner {
        sport = _sport;
    }

    function getAvailableAmountOfContract() external view returns(uint256){
        if((block.timestamp- startTimeStamp)/ 1 days > 0){
            return ISport(sport).balanceOf(address(this)) - totalAmountsOfDay[block.timestamp] - totalAmountsOfDay[block.timestamp - 86400];
        }
        else{
            return 0;
        }
    }

    function withdraw(address _feeReceiver, uint256 _amount) external {
        require((block.timestamp- startTimeStamp)/ 1 days > 0 ,"withdraw day should be bigger than start day + 1 day.");
        uint256 remainAmounts = totalAmountsOfDay[block.timestamp] + totalAmountsOfDay[block.timestamp - 86400];
        require(ISport(sport).balanceOf(address(this)) - _amount > remainAmounts, "Balance must be bigger than amount + bettingAmounts of today and yesterday.");
        require(feeReceiver == _feeReceiver || owner == _msgSender(), "msg sender must be feeReceiver or contract owner");
        ISport(sport).transfer(feeReceiver, _amount);         
    }	

    function withdrawAll(address _feeReceiver) external{

        require((block.timestamp- startTimeStamp)/ 1 days > 0 ,"withdraw day should be bigger than start day + 1 day.");
        uint256 remainAmounts = totalAmountsOfDay[block.timestamp] + totalAmountsOfDay[block.timestamp - 86400];
        require(ISport(sport).balanceOf(address(this)) > remainAmounts, "Balance must be bigger than amount + bettingAmounts of today and yesterday.");
        require(feeReceiver == _feeReceiver || owner == _msgSender(), "msg sender must be feeReceiver or contract owner");
        ISport(sport).transfer(feeReceiver, ISport(sport).balanceOf(address(this)) - remainAmounts);      
    }
}