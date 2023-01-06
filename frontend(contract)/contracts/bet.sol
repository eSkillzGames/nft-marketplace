//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
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

contract ESkillzStraightBet is Ownable {
    using SafeMath for uint256;
    uint256 public GameIDs;
    uint256 public minBetAmounts;
    address public sport;
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
    uint256 startTimeStamp;
    event BetEvent(uint256 _game, uint256 _amount);

    modifier onlySportContract {
      require(msg.sender == sport);
      _;
    }

    constructor (address _sport) { 
        sport = _sport;  
        eskillz_fee = 500; 
        feeReceiver = 0x099b7b28AC913efbb3236946769AC6D3819329ab;
        ISport(sport).approve(feeReceiver, 1000000000000000000);  
        minBetAmounts = 1000000000;
        startTimeStamp = block.timestamp;    
    }
   
    function  SetGameIDToZero() external onlyOwner{

      GameIDs = 0;

    }

    function  SetMinBetAmounts(uint256 _amounts) external onlyOwner{

      minBetAmounts = _amounts;

    }
  
    function  CreateSPGame(address _sender, uint256 amount) external onlySportContract{
      require(minBetAmounts<= amount, "Bet amounts must be bigger than minBetAmounts");
      totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] +=amount;
      GameIDs++;
      ISport(sport).transferFrom(_sender, address(this), amount);
      delete(gamebetting[GameIDs]);
      gamebetting[GameIDs].push(Bet(_sender, amount, 0));
      emit BetEvent(GameIDs, amount);
    }
    
    function SetSPGameResult(uint256 GameID, uint256 result) external {
        
        (uint256 amountToWinner,uint256 amountToESkillz) = getAmountsSPGameToDistribute(GameID);
        require(gamebetting[GameID][0].player == msg.sender, "Other Players can not access.");
        require(gamebetting[GameID][0].gameType == 0, "You can set the SP game only");
        require(ISport(sport).balanceOf(address(this)) >= gamebetting[GameID][0].amount, "Dport Balance of Bet contract is not enough.");
        ISport(sport).mintMore(msg.sender, gamebetting[GameID][0].amount*result/100);
        ISport(sport).transfer(msg.sender, amountToWinner);
        ISport(sport).transfer(feeReceiver, amountToESkillz);
        if(totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] >= (gamebetting[GameID][0].amount)){

            totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] -=(gamebetting[GameID][0].amount);
        }
        else{
            if((block.timestamp- startTimeStamp)/ 1 days > 0){

                totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days - 1] -=(gamebetting[GameID][0].amount);
            }
        }
        delete(gamebetting[GameID]);
    }

    function  CreateMPGame(address _sender, uint256 amount) external onlySportContract{
      require(minBetAmounts<= amount, "Bet amounts must be bigger than minBetAmounts");
      totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] += amount;
      GameIDs++;
      ISport(sport).transferFrom(_sender, address(this), amount);
      delete(gamebetting[GameIDs]);
      gamebetting[GameIDs].push(Bet(_sender, amount, 1));
      emit BetEvent(GameIDs, amount);
    }

    function  JoinMPGame(address _sender, uint256 gameID, uint256 amount) external onlySportContract{
      require(gamebetting[gameID].length == 1, "Players can not join.");
      require(gamebetting[gameID][0].player != _sender, "Same Players can not join.");
      require(amount== gamebetting[gameID][0].amount, "Your bet amount must equals create amount");
      require(gamebetting[gameID][0].gameType == 1, "You can join the MP game only");
      totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] += amount;
      ISport(sport).transferFrom(_sender, address(this), amount);
      gamebetting[gameID].push(Bet(_sender, amount, 1));
      emit BetEvent(gameID, amount);
    }

    function SetMPGameResult(uint256 GameID) external {
        (uint256 amountToWinner,uint256 amountToESkillz) = getAmountsMPGameToDistribute(GameID);
        require(gamebetting[GameID][0].gameType == 1 && gamebetting[GameID][1].gameType == 1, "You can set the MP game only");
        require(msg.sender == gamebetting[GameID][0].player || msg.sender == gamebetting[GameID][1].player, "msg sender must includes in this game");
        require(ISport(sport).balanceOf(address(this)) >= gamebetting[GameID][0].amount *2, "Dport Balance of Bet contract is not enough.");

        if(msg.sender == gamebetting[GameID][0].player) {
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

    function getAmountsSPGameToDistribute(uint256 game) private view returns (uint256, uint256) {
        uint256 amountToESkillz = gamebetting[game][0].amount*eskillz_fee/10000;
        uint256 amountToWinner = gamebetting[game][0].amount - amountToESkillz;
        return(amountToWinner, amountToESkillz);
    }

    function getAmountsMPGameToDistribute(uint256 game) private view returns (uint256, uint256) {
        uint256 amountToESkillz = gamebetting[game][0].amount*eskillz_fee/10000;
        uint256 amountToWinner = 2 * gamebetting[game][0].amount - amountToESkillz;
        return(amountToWinner, amountToESkillz);
    }   

    function getPlayerLength(uint256 game) external view returns (uint256) {
        return gamebetting[game].length;
    }
    
    function setFeeReceiver(address _address) external onlyOwner {
        feeReceiver = _address;
        ISport(sport).approve(feeReceiver, 1000000000000000000);  
    }

    function setFee(uint256 _fee) external onlyOwner {
        eskillz_fee = _fee;
    }

    function setSportAddress(address _sport) external onlyOwner {
        sport = _sport;
    }

    function getAvailableAmountOfContract() external view returns(uint256){
        if((block.timestamp- startTimeStamp)/ 1 days > 0){
            return ISport(sport).balanceOf(address(this)) - totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] - totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days - 1];
        }
        else{
            return 0;
        }
    }

    function withdraw(uint256 _amount) external {
        require((block.timestamp- startTimeStamp)/ 1 days > 0 ,"withdraw day should be bigger than start day + 1 day.");
        uint256 remainAmounts = totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] + totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days - 1];
        require(ISport(sport).balanceOf(address(this)) - _amount > remainAmounts, "Balance must be bigger than amount + bettingAmounts of today and yesterday.");
        require(feeReceiver == msg.sender || owner() == msg.sender, "msg sender must be feeReceiver or contract owner");
        ISport(sport).transfer(feeReceiver, _amount);         
    }	

    function withdrawAll() external{

        require((block.timestamp- startTimeStamp)/ 1 days > 0 ,"withdraw day should be bigger than start day + 1 day.");
        uint256 remainAmounts = totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days] + totalAmountsOfDay[(block.timestamp- startTimeStamp)/ 1 days - 1];
        require(ISport(sport).balanceOf(address(this)) > remainAmounts, "Balance must be bigger than amount + bettingAmounts of today and yesterday.");
        require(feeReceiver == msg.sender || owner() == msg.sender, "msg sender must be feeReceiver or contract owner");
        ISport(sport).transfer(feeReceiver, ISport(sport).balanceOf(address(this)) - remainAmounts);      
    }
	
}