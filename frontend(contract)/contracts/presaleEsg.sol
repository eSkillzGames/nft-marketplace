//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract EsgTokenSale is Initializable, UUPSUpgradeable, OwnableUpgradeable{
    using SafeMathUpgradeable for uint256;
    IERC20Upgradeable public esg;
    uint256 constant BP = 10000;
    bool    public started;
    uint256 public price;
    uint256 public totalOwed;
    uint256 public weiRaised;

    
    function initialize(address addr) public initializer {

        esg = IERC20Upgradeable(addr);

        ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
        __Ownable_init();
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function setPrice(uint256 _price) public onlyOwner { price = _price; }
    function setEsg(address addr) public onlyOwner{
        esg = IERC20Upgradeable(addr);
    }
    function unlock() public onlyOwner { started =  false; }

    function withdrawETH(address payable _addr, uint256 amount) public onlyOwner {
        _addr.transfer(amount);
    }

    function withdrawETHOwner(uint256 amount) public onlyOwner {
        payable(msg.sender).transfer(amount);
    }

    function withdrawUnsold(address _addr, uint256 amount) public onlyOwner {
        require(amount <= esg.balanceOf(address(this)).sub(totalOwed), "insufficient balance");
        esg.transfer(_addr, amount);
    }

    // start the presale
    function startPresale() public onlyOwner {
        require(!started, "already started!");
        require(price > 0, "set price first!");
        started = true;
    }

    // the amount of esg purchased
    function calculateAmountPurchased(uint256 _value) public view returns (uint256) {
        return _value.mul(BP).mul(price).div(10**9).div(BP);
    }
    
    // purchase tokens
    function buy() public payable {
        require(started, "token sale is not started");
        uint256 amount = calculateAmountPurchased(msg.value);
        require(amount <= esg.balanceOf(address(this)), "sold out");
        require(esg.transfer(msg.sender, amount), "failed to buy");
        totalOwed = totalOwed.add(amount);
        weiRaised = weiRaised.add(msg.value);
    }

    fallback() external payable { buy(); }
    receive() external payable { buy(); }
}