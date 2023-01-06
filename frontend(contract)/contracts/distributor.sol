//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface IDividendDistributor {
    function setShare(address shareholder, uint256 amount) external;
    function setSportToken(address _address) external;
    function process(uint256 gas) external;
}

contract DividendDistributor is IDividendDistributor, Initializable, UUPSUpgradeable, OwnableUpgradeable{
    using SafeMathUpgradeable for uint256;

    address public tokenAddress;
    address public _sportTokenAddr;
    IERC20Upgradeable public _sportToken;

    address[] public shareholders;
    mapping (address => uint256) shareholderIndexes;
    mapping (address => uint256) public shareholderEsgBalance;
    mapping (address => uint256) holdingTime;
    mapping (address => bool) public isshareholder;
    mapping (address => uint256) public shareholderClaims;
    mapping (address => uint256) public claimAmounts;

    uint256 public constant minPeriod = 1 days;
    mapping(address => uint256) public distributedAmounts;

    uint256 currentIndex;

    modifier onlyToken() {
        require(msg.sender == address(tokenAddress)); _;
    }

    function initialize() public initializer {

        ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
        __Ownable_init();
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function setESGToken(address _token) external onlyOwner {
        
        tokenAddress = _token;
    }

    function setSportToken(address _address) external override onlyToken {
        _sportTokenAddr = _address;
        _sportToken = IERC20Upgradeable(_sportTokenAddr);
    }
    function setShare(address shareholder, uint256 amount) external override onlyToken {
        shareholderEsgBalance[shareholder] = amount;
        if(amount==0){removeShareholder(shareholder); return;} 
        if(isshareholder[shareholder] == false) addShareholder(shareholder); 
    }

    function getDiffDays(address holder) internal view returns(uint256) {
        uint256 retVal = (block.timestamp - holdingTime[holder]).div(60).div(60).div(24);
        return retVal + 1;
    }

    function getDenominator() internal view returns(uint256) {
        uint256 retVal = 0;
        for(uint256 i=0;i<shareholders.length;i++) {
            retVal = retVal.add(shareholderEsgBalance[shareholders[i]].mul(getDiffDays(shareholders[i])));
        }
        return retVal;
    }

    function process(uint256 gas) external override onlyToken {
        if(_sportToken.balanceOf(address(this))<=0) return;
        uint256 sportBalance = _sportToken.balanceOf(address(this));
        uint256 shareholderCount = shareholders.length;
        if(shareholderCount == 0) { return; }

        uint256 gasUsed = 0;
        uint256 gasLeft = gasleft();

        uint256 iterations = 0;
        uint256 denominator = getDenominator();
        while(gasUsed < gas && iterations < shareholderCount) {
            if(currentIndex >= shareholderCount){
                currentIndex = 0;
            }
            
            if(shouldDistribute(shareholders[currentIndex])){
                distributeDividend(shareholders[currentIndex], sportBalance.mul(shareholderEsgBalance[shareholders[currentIndex]].mul(getDiffDays(shareholders[currentIndex]))).div(denominator));
            }

            gasUsed = gasUsed.add(gasLeft.sub(gasleft()));
            gasLeft = gasleft();
            currentIndex++;
            iterations++;
        }
    }

    function shouldDistribute(address shareholder) internal view returns (bool) {
        return shareholderClaims[shareholder] + minPeriod < block.timestamp;
    }

    function distributeDividend(address shareholder, uint256 amount) internal {
        if(shareholderEsgBalance[shareholder] == 0){ return; }

        if(amount > 0){
            _sportToken.transfer(shareholder, amount);
            shareholderClaims[shareholder] = block.timestamp;
            claimAmounts[shareholder] = amount;
            distributedAmounts[shareholder] = distributedAmounts[shareholder] + amount;
        }
    }

    function getYesterdayYield(address _address) external view returns (uint256) {
        if(claimAmounts[_address]==0) return 0;
        else if((block.timestamp - shareholderClaims[_address]) / 1 days == 1) return claimAmounts[_address];
        else return 0;
    }

    function addShareholder(address shareholder) internal {
        holdingTime[shareholder] = block.timestamp;
        isshareholder[shareholder] = true;
        shareholderIndexes[shareholder] = shareholders.length;
        shareholders.push(shareholder);
    }

    function removeShareholder(address shareholder) internal {
        isshareholder[shareholder] = false;
        shareholders[shareholderIndexes[shareholder]] = shareholders[shareholders.length-1];
        shareholderIndexes[shareholders[shareholders.length-1]] = shareholderIndexes[shareholder];
        shareholders.pop();
    }
}