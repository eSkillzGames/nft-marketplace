//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "metakeep-lambda/ethereum/contracts/MetaKeepLambda.sol";

interface IDEXFactory {
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface IDEXRouter {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

interface IBet {
    event BetEvent(uint256 _game, uint256 _amount);
    function  CreateSPGame(address _sender, uint256 amount) external;
    function  CreateMPGame(address _sender, uint256 amount) external;
    function  JoinMPGame(address _sender, uint256 gameID, uint256 amount) external;
}


contract SPORT is MetaKeepLambda, IERC20 {
    using SafeMath for uint256;

    address owner;
    address public MATIC ;
    address constant DEAD = 0x000000000000000000000000000000000000dEaD;
    address constant ZERO = 0x0000000000000000000000000000000000000000;

    string constant _name = "SPROT";
    string constant _symbol = "SPORT";
    uint8 constant _decimals = 9;
    
    uint256 _totalSupply;

    mapping (address => uint256) _balances;
    mapping (address => mapping (address => uint256)) _allowances;

    // address public distributor;
    // uint256 public distributionFee ;
    // uint256 public feeDenominator ;

    IDEXRouter public router;
    address public pair;

    address public ESkillzBet;

    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }

    constructor (address _dexRouter, address lambdaOwner, string memory lambdaName) MetaKeepLambda(lambdaOwner, lambdaName) { 
        owner = lambdaOwner;

        _totalSupply = 500000000 * (10 ** _decimals);
        // distributionFee = 1000;
        // feeDenominator = 10000;
        router = IDEXRouter(_dexRouter);
        MATIC = router.WETH();
        pair = IDEXFactory(router.factory()).createPair(MATIC, address(this));
        _allowances[address(this)][address(router)] = _totalSupply;
        
        approve(_dexRouter, _totalSupply);
        approve(address(pair), _totalSupply);
        _balances[_msgSender()] = _totalSupply;
        emit Transfer(address(0), _msgSender(), _totalSupply); 
    }

    
    receive() external payable { }

    function totalSupply() external view override returns (uint256) { return _totalSupply; }
    function decimals() external pure returns (uint8) { return _decimals; }
    function symbol() external pure returns (string memory) { return _symbol; }
    function name() external pure returns (string memory) { return _name; }
    function getOwner() external view returns (address) { return owner; }
    function balanceOf(address account) public view override returns (uint256) { return _balances[account]; }
    function allowance(address holder, address spender) external view override returns (uint256) { return _allowances[holder][spender]; }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _allowances[_msgSender()][spender] = amount;
        emit Approval(_msgSender(), spender, amount);
        return true;
    }

    function approveFrom(address from, address spender, uint256 amount) public returns (bool) {
        _allowances[from][spender] = amount;
        emit Approval(from, spender, amount);
        return true;
    }

    function approveMax(address spender) external returns (bool) {
        return approve(spender, _totalSupply);
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        return _transferFrom(_msgSender(), recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        if(_allowances[sender][_msgSender()] != _totalSupply){
            _allowances[sender][_msgSender()] = _allowances[sender][_msgSender()].sub(amount, "Insufficient Allowance");
        }

        return _transferFrom(sender, recipient, amount);
    }

    function _transferFrom(address sender, address recipient, uint256 amount) internal returns (bool) {
        // if(sender==address(pair)) {
        //     uint256 distributionAmount = amount.mul(distributionFee).div(feeDenominator);
        //     _balances[distributor] = _balances[distributor].add(distributionAmount);
        //     emit Transfer(address(0), distributor, distributionAmount);    
        // }
        return _basicTransfer(sender, recipient, amount);
    }

    function _basicTransfer(address sender, address recipient, uint256 amount) internal returns (bool) {
        _balances[sender] = _balances[sender].sub(amount, "Insufficient Balance");
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
        return true;
    }

    // function setFees(uint256 _distributionFee, uint256 _feeDenominator) external onlyMetaKeepLambdaOwner()  {
    //     distributionFee = _distributionFee;
    //     feeDenominator = _feeDenominator;
    //     require(distributionFee <= feeDenominator/4, "Fee cannot exceed 25%");
    // }

    // function setDistributorAddr(address _address) external onlyMetaKeepLambdaOwner()  {
    //     distributor = _address;
    // }

    function mintMore(address _toAddress, uint256 amount) external returns (bool){
        require(_msgSender() == owner || _msgSender() == address(ESkillzBet), "caller is not owner or betting contract.");
        require(amount>0, "Amount should be bigger than zero");
        _balances[_toAddress] = _balances[_toAddress].add(amount);
        emit Transfer(address(0), _toAddress, amount);
        return true;
    }

     function mintSportToUser(uint256 _amounts, address _toAddress) external {
        require(_toAddress != address(0), "ToAddress must not be Zero address.");
        require(_amounts>0, "Amount should be bigger than zero");
        _balances[_toAddress] +=_amounts;
        emit Transfer(address(0), _toAddress, _amounts);
    }  

    function approveAndCreateSPGame(address spender, address creator, uint256 amount) external {
        require(amount>0, "Amount should be bigger than zero");
        approveFrom(creator, spender, amount);
        IBet(ESkillzBet).CreateSPGame(creator, amount);
    }

    function approveAndCreateMPGame(address spender, address creator, uint256 amount) external {
        require(amount>0, "Amount should be bigger than zero");
        approveFrom(creator, spender, amount);
        IBet(ESkillzBet).CreateMPGame(creator, amount);
    }

    function approveAndJoinMPGame(address spender, address joiner, uint256 amount, uint256 gameID) external {
        require(amount>0, "Amount should be bigger than zero");
        approveFrom(joiner, spender, amount);
        IBet(ESkillzBet).JoinMPGame(joiner, gameID, amount);
    }

    function setEskillzBet(address _ESkillzBet) external onlyMetaKeepLambdaOwner() {
        ESkillzBet = _ESkillzBet;
    }
     
    function getCirculatingSupply() public view returns (uint256) {
        return _totalSupply.sub(balanceOf(DEAD)).sub(balanceOf(ZERO));
    }
}
