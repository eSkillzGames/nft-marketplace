//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./distributor.sol";

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

contract ESG is IERC20Upgradeable, Initializable, UUPSUpgradeable, OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;

    address public MATIC;
    address constant DEAD = 0x000000000000000000000000000000000000dEaD;
    address constant ZERO = 0x0000000000000000000000000000000000000000;

    string constant _name = "eSkillz Game";
    string constant _symbol = "ESG";
    uint8 constant _decimals = 9;
    
    uint256 _totalSupply;

    mapping (address => uint256) _balances;
    mapping (address => mapping (address => uint256)) _allowances;

    DividendDistributor distributor;
    address public distributorAddress;
    mapping (address => bool) public isShareExempt;

    uint256 public taxFee;
    uint256 public feeDenominator;
    uint256 distributorGas;

    address public taxFeeReceiver;
    uint8 public taxOption;

    IDEXRouter public router;
    address public pair;

    event WithdrawTreasury(uint256 amount);   

    function initialize(address _dexRouter, address _distributor) public initializer {

       _totalSupply = 100000000 * (10 ** _decimals);
        taxFee = 800;
        feeDenominator = 10000;
        distributorGas = 500000;
        taxOption = 1;
        router = IDEXRouter(_dexRouter);
        MATIC = router.WETH();
        pair = IDEXFactory(router.factory()).createPair(MATIC, address(this));

        isShareExempt[address(router)] = true;
        isShareExempt[address(pair)] = true;
        isShareExempt[msg.sender] = true;

        _allowances[address(this)][address(router)] = _totalSupply;        

        taxFeeReceiver = 0x099b7b28AC913efbb3236946769AC6D3819329ab;
        
        distributor = DividendDistributor(_distributor);
        distributorAddress = address(distributor);
        approve(_dexRouter, _totalSupply);
        approve(address(pair), _totalSupply);
        _balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);

        ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
        __Ownable_init();
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    receive() external payable { }

    function totalSupply() external view override returns (uint256) { return _totalSupply; }
    function decimals() public pure returns (uint8) { return _decimals; }
    function symbol() public pure returns (string memory) { return _symbol; }
    function name() public pure returns (string memory) { return _name; }
    function getOwner() external view returns (address) { return owner(); }
    function balanceOf(address account) public view override returns (uint256) { return _balances[account]; }
    function allowance(address holder, address spender) external view override returns (uint256) { return _allowances[holder][spender]; }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function approveMax(address spender) external returns (bool) {
        return approve(spender, _totalSupply);
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        return _transferFrom(msg.sender, recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        if(_allowances[sender][msg.sender] != _totalSupply) {
            _allowances[sender][msg.sender] = _allowances[sender][msg.sender].sub(amount, "Insufficient Allowance");
        }

        return _transferFrom(sender, recipient, amount);
    }

    function _transferFrom(address sender, address recipient, uint256 amount) internal returns (bool) {
        if(sender==address(pair)) {
            _balances[sender] = _balances[sender].sub(amount, "Insufficient Balance");
            uint256 amountReceived = takeFee(sender, amount);
            _balances[recipient] = _balances[recipient].add(amountReceived);

            if(!isShareExempt[recipient]) {
                try distributor.setShare(recipient, _balances[recipient]) {} catch {}
            }
            if (!isShareExempt[sender] || !isShareExempt[recipient]) {
                try distributor.process(distributorGas) {} catch {}
            }
            
            emit Transfer(sender, recipient, amountReceived);
            return true;
        } else {
            return _basicTransfer(sender, recipient, amount);
        }
    }

    function _basicTransfer(address sender, address recipient, uint256 amount) internal returns (bool) {
        _balances[sender] = _balances[sender].sub(amount, "Insufficient Balance");
        _balances[recipient] = _balances[recipient].add(amount);
        if(!isShareExempt[sender]) {
            try distributor.setShare(sender, _balances[sender]) {} catch {}
        }
        if(!isShareExempt[recipient]) {
            try distributor.setShare(recipient, _balances[recipient]) {} catch {}
        }
        if (!isShareExempt[sender] || !isShareExempt[recipient]) {
            try distributor.process(distributorGas) {} catch {}
        }
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function setShareExempt(address _address, bool _exempt) external onlyOwner {
        isShareExempt[_address] = _exempt;
    }

    function withdrawToTreasury() external onlyOwner {
        uint256 amount = balanceOf(address(this));
        address USDC = 0x07865c6E87B9F70255377e024ace6630C1Eaa37F;
        if(amount>0) {
            if(taxOption==2) {
                address[] memory path = new address[](2);
                path[0] = address(this);
                path[1] = MATIC;
                router.swapExactTokensForETHSupportingFeeOnTransferTokens(
                    amount,
                    0,
                    path,
                    taxFeeReceiver,
                    block.timestamp
                );
            } else if(taxOption==3) {
                address[] memory path = new address[](3);
                path[0] = address(this);
                path[1] = address(router.WETH());
                path[2] = USDC;
                router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                    amount,
                    0,
                    path,
                    taxFeeReceiver,
                    block.timestamp
                );
            }
            emit WithdrawTreasury(amount);
        }
    }

    function takeFee(address sender, uint256 amount) internal returns (uint256) {
        uint256 feeAmount = amount.mul(taxFee).div(feeDenominator);
        if(taxOption==1) {
            _balances[taxFeeReceiver] = _balances[taxFeeReceiver].add(feeAmount);
            emit Transfer(sender, taxFeeReceiver, feeAmount);
        } else {
            _balances[address(this)] = _balances[address(this)].add(feeAmount);
            emit Transfer(sender, address(this), feeAmount);
        }
        return amount.sub(feeAmount);
    }

    function setFees(uint256 _taxFee, uint256 _feeDenominator) external onlyOwner {
        taxFee = _taxFee;
        feeDenominator = _feeDenominator;
        require(taxFee <= feeDenominator/4, "Fee cannot exceed 25%");
    }
    
    function setSportToken(address _address) external onlyOwner {
        distributor.setSportToken(_address);
    }

    function setFeeReceivers(address _taxFeeReceiver) external onlyOwner {
        taxFeeReceiver = _taxFeeReceiver;
    }

    function setTaxOption(uint8 _taxOption) external onlyOwner {
        taxOption = _taxOption;
    }

    function getCirculatingSupply() public view returns (uint256) {
        return _totalSupply.sub(balanceOf(DEAD)).sub(balanceOf(ZERO));
    }
}