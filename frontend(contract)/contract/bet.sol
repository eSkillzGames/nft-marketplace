//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./sport.sol";

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ESkillzStraightBet is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;
    uint256 public GameIDs;
    uint256 public minBetAmounts;
    SPORT public sport;
    struct Bet {
        address player;
        uint256 amount;
        uint256 gameType; // sp 0, mp 1
    }
    
    mapping(uint256 => Bet[]) public gamebetting;
    mapping(address => uint256) public staking;
    mapping(uint256 => uint256) public totalAmountsOfDay;
    uint256 public eskillz_fee;
    address public feeReceiver;
    uint256 startTimeStamp;
    event BetEvent(uint256 _game, uint256 _amount);

    modifier onlyReceiver {
      require(msg.sender == feeReceiver);
      _;
    }

    modifier onlySportContract {
      require(msg.sender == address(sport));
      _;
    }


    function initialize(SPORT _sport) public initializer {
        sport = _sport;  
        eskillz_fee = 5; 
        feeReceiver = 0x099b7b28AC913efbb3236946769AC6D3819329ab;
        sport.approve(feeReceiver, 1000000000000000000);  
        minBetAmounts = 1000;
        startTimeStamp = block.timestamp;
        __Ownable_init();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function  SetGameIDToZero() external onlyOwner{

      GameIDs = 0;

    }

    function  SetMinBetAmounts(uint256 _amounts) external onlyOwner{

      minBetAmounts = _amounts;

    }

    function  SendSportToContract(address _sender, uint256 amount) external onlySportContract{
      staking[_sender] = staking[_sender] + amount;

    }

    function  withDrawSportFromContract(uint256 amount) external {
      require(0 < amount , "Withdraw amounts must be bigger than zero.");
      require(staking[msg.sender] >= amount , "Withdraw amounts must be smaller than balance of staking.");
      sport.transfer(msg.sender, amount);
      
      staking[msg.sender] = staking[msg.sender] - amount;

    }
    
    function  CreateSPGame(address _sender, uint256 amount) external onlyReceiver{
      require(minBetAmounts<= amount, "Bet amounts must be bigger than minBetAmounts");
      require(staking[_sender]>=amount, "Staking Amounts must bigger than bet amounts");
     
      staking[_sender] = staking[_sender] - amount;
      totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] +=amount;
      GameIDs++;
      delete(gamebetting[GameIDs]);
      gamebetting[GameIDs].push(Bet(_sender, amount, 0));
      emit BetEvent(GameIDs, amount);
    }
    
    function SetSPGameResult(address _sender,uint256 GameID, uint256 result) external onlyReceiver{
        
        uint256 amountToWinner = getAmountsSPGameToDistribute(GameID,result);
        require(gamebetting[GameID][0].player == _sender, "Other Players can not access.");
        require(gamebetting[GameID][0].gameType == 0, "You can set the SP game only");
        sport.mintMore(address(this), gamebetting[GameID][0].amount.mul(result).div(100));
        
        staking[_sender] = staking[_sender] + amountToWinner;
        delete(gamebetting[GameID]);
    }

    function  CreateMPGame(address _creator, address _joiner, uint256 amount) external onlyReceiver{

      require(minBetAmounts<= amount, "Bet amounts must be bigger than minBetAmounts");
      require(staking[_creator]>=amount, "Creator Staking Amounts must bigger than bet amounts");
      require(staking[_joiner]>=amount, "Joiner Staking Amounts must bigger than bet amounts");
           
      staking[_creator] = staking[_creator] - amount;
      staking[_joiner] = staking[_joiner] - amount;
      totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] += 2 * amount;
      GameIDs++; 
      delete(gamebetting[GameIDs]);  
      gamebetting[GameIDs].push(Bet(_creator, amount, 1));
      gamebetting[GameIDs].push(Bet(_joiner, amount, 1));
      emit BetEvent(GameIDs, amount);

    }
    
    function SetMPGameResult(address _sender, uint256 GameID) external onlyReceiver{
        uint256 amountToWinner = getAmountsMPGameToDistribute(GameID);

        require(gamebetting[GameID][0].gameType == 1 && gamebetting[GameID][1].gameType == 1, "You can set the MP game only");
        require(_sender == gamebetting[GameID][0].player || _sender == gamebetting[GameID][1].player, "sender must includes in this game");

        if(_sender == gamebetting[GameID][0].player) {
            staking[gamebetting[GameID][0].player] = staking[gamebetting[GameID][0].player] +amountToWinner;
           
        } else {
            staking[gamebetting[GameID][1].player] = staking[gamebetting[GameID][1].player] +amountToWinner;
        }  
        delete(gamebetting[GameID]);
    }

    function getStakingAmountsOfPlayer(address _player) external view returns (uint256) {
        return  staking[_player];
    }

    function genRand(uint256 maxNum) private view returns (uint256) {
        require(maxNum>0, "maxNum should be bigger than zero");
        return uint256(uint256(keccak256(abi.encode(block.timestamp, block.difficulty))) % maxNum);
    }

    function getPlayerLength(uint256 game) external view returns (uint256) {
        return gamebetting[game].length;
    }
    
    function getAmountsSPGameToDistribute(uint256 game, uint256 result) private view returns (uint256 amountToWinner) {
        amountToWinner = gamebetting[game][0].amount+gamebetting[game][0].amount.mul(result).div(100)-(gamebetting[game][0].amount).mul(eskillz_fee).div(100);
    }    

    function getAmountsMPGameToDistribute(uint256 game) private view returns (uint256 amountToWinner) {
        amountToWinner = (gamebetting[game][0].amount+gamebetting[game][1].amount).mul(100-eskillz_fee).div(100);
    }

    function setFeeReceiver(address _address) external onlyOwner {
        feeReceiver = _address;
        sport.approve(feeReceiver, 1000000000000000000);  
    }

    function setFee(uint256 _fee) external onlyOwner {
        eskillz_fee = _fee;
    }

    function getAvailableAmountOfContract() external view returns(uint256){
        if((block.timestamp- startTimeStamp)/ 1 days > 1){
            return sport.balanceOf(address(this)) - totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] - totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days - 1];
        }
        else{
            return 0;
        }
    }

    function withdraw(uint256 _amount) external {
        require((block.timestamp- startTimeStamp)/ 1 days > 1 ,"withdraw day should be bigger than start day + 1 day.");
        uint256 remainAmounts = totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] + totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days - 1];
        require(sport.balanceOf(address(this)) - _amount > remainAmounts, "Balance must be bigger than amount + bettingAmounts of today and yesterday.");
        require(feeReceiver == msg.sender || owner() == msg.sender, "msg sender must be feeReceiver or contract owner");
        sport.transfer(feeReceiver, _amount);         
    }	

    function withdrawAll() external{

        require((block.timestamp- startTimeStamp)/ 1 days > 1 ,"withdraw day should be bigger than start day + 1 day.");
        uint256 remainAmounts = totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] + totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days - 1];
        require(sport.balanceOf(address(this)) > remainAmounts, "Balance must be bigger than amount + bettingAmounts of today and yesterday.");
        require(feeReceiver == msg.sender || owner() == msg.sender, "msg sender must be feeReceiver or contract owner");
        sport.transfer(feeReceiver, sport.balanceOf(address(this)) - remainAmounts);      
    }
	
}