//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "metakeep-lambda/ethereum/contracts/MetaKeepLambda.sol";

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

contract Tournament is MetaKeepLambda {
    using Counters for Counters.Counter;

    address public sport;

    struct TournamentInfo {
        uint256 tournamentId;
        string name;
        address creator;
        uint minNumOfPlayers;
        uint maxNumOfPlayers;
        uint entryFee;
        uint startDate;
        address[] playerList;
        uint prize1;
        uint prize2;
        uint prize3;
        uint prizeAmount;
        address winner1;
        address winner2;
        address winner3;
        statuses status;
    }
    mapping(uint256 => mapping(address => bool)) isExistPlayer;

    Counters.Counter _tournamentIds;
    mapping(uint256 => TournamentInfo) tournamentList;

    // Possible statuses of the tournament
    enum statuses {
        NotTerminated,
        LackOfPlayers,
        Cancelled,
        NoWinner,
        Winner
    }
    // Current status of the tournament (initial value is NotTerminated)

    // The event of the contract creation
    event onCreation(uint256 id, string name, uint startDate);
    // Enter Lobby
    event onEnterLobby(uint256 id, string name, address player);
    // Play Game
    event onPlayGame(uint256 id, string name, address player, uint256 amount);

    // // Unregistering event
    // event onUnregistering(address entrantAddress, int entrancesCounter);
    // // Deadline change event
    // event onDeadlineChange(uint newDeadline);
    // The event of the winner announcement
    event onWinnerAnnouncement(
        uint256 id,
        address winner1,
        address winner2,
        address winner3
    );
    // The event of the prize payment to the winner
    // event onPrizePayment(address winnerAddress, uint amount);
    // The event of the tournament termination with one of the statuses
    // LackOfPlayers, Cancelled and NoWinner
    event onTermination(statuses status);
    // Refund event
    // event onRefund(address playerAddress);
    // Withdrawal event
    event onWithdrawal(uint amount);

    constructor(
        address _sport,
        address lambdaOwner,
        string memory lambdaName
    ) MetaKeepLambda(lambdaOwner, lambdaName) {
        sport = _sport;
        ISport(sport).approve(address(this), 1000000000000000000);
    }

    modifier checkTermination(uint256 tournamentId) {
        statuses _status = tournamentList[tournamentId].status;
        if (_status == statuses.LackOfPlayers) {
            revert("The tournament has been terminated due to lack of players");
        }
        if (_status == statuses.Cancelled || _status == statuses.NoWinner) {
            revert("The tournament has been terminated by the organizer");
        }
        if (_status == statuses.Winner) {
            revert("The tournament has been finished with winner announcement");
        }
        _;
    }

    function formatTournamentId() public {
        _tournamentIds.reset();
    }

    function setSportAddress(address _sport) public {
        sport = _sport;
    }

    function getTournamentInfo(
        uint256 id
    ) public view returns (TournamentInfo memory) {
        return tournamentList[id];
    }

    function getIsExistPlayer(
        uint256 id,
        address player
    ) public view returns (bool) {
        return isExistPlayer[id][player];
    }

    function getCurrentId() public view returns (uint256) {
        return _tournamentIds.current();
    }

    function createTournament(
        address creator,
        string memory _name,
        uint _minNumOfPlayers,
        uint _maxNumOfPlayers,
        uint _entryFee,
        uint _startDate,
        uint _prize1,
        uint _prize2,
        uint _prize3,
        uint _prizeAmount
    ) public returns (uint) {
        _tournamentIds.increment();
        uint tournamentID = _tournamentIds.current();
        tournamentList[tournamentID].tournamentId = tournamentID;
        tournamentList[tournamentID].name = _name;
        tournamentList[tournamentID].creator = creator;
        tournamentList[tournamentID].minNumOfPlayers = _minNumOfPlayers;
        tournamentList[tournamentID].maxNumOfPlayers = _maxNumOfPlayers;
        tournamentList[tournamentID].entryFee = _entryFee;
        tournamentList[tournamentID].startDate = _startDate;
        tournamentList[tournamentID].prize1 = _prize1;
        tournamentList[tournamentID].prize2 = _prize2;
        tournamentList[tournamentID].prize3 = _prize3;
        tournamentList[tournamentID].prizeAmount = _prizeAmount;
        tournamentList[tournamentID].status = statuses.NotTerminated;
        emit onCreation(tournamentID, _name, _startDate);

        return tournamentID;
    }

    /// enter accepts buy-ins from participants and register them for the tournament
    function enterLobby(
        uint256 id,
        address player
    ) public checkTermination(id) {
        require(
            block.timestamp > tournamentList[id].startDate,
            "The tournament isn't started."
        );
        require(
            isExistPlayer[id][player] == false,
            "You are already in the list of players"
        );

        isExistPlayer[id][player] = true;
        tournamentList[id].playerList.push(player);

        emit onEnterLobby(id, tournamentList[id].name, player);
    }

    function playGame(
        uint256 id,
        address player,
        uint256 amount
    ) public checkTermination(id) {
        require(
            block.timestamp > tournamentList[id].startDate,
            "The tournament isn't started."
        );
        require(isExistPlayer[id][player] == true, "You are not in the Lobby");
        require(
            amount == tournamentList[id].entryFee,
            "The amount you deposit is not equal to the EntryFee amount"
        );

        ISport(sport).transferFrom(player, address(this), amount);

        emit onPlayGame(id, tournamentList[id].name, player, amount);
    }

    /// unregister lets participants to unregister for the tournament
    /// with full refund
    // function unregister(address player)
    //     public
    //     checkTermination
    // {
    //     int _entranceCounter = entranceCounters[player];

    //     require(
    //         block.timestamp < deadline,
    //         "Time to unregister for the tournament has passed"
    //     );
    //     require(
    //         _entranceCounter > 0,
    //         "You are not in the list of players"
    //     );

    //     _entranceCounter = -_entranceCounter;
    //     entranceCounters[player] = _entranceCounter;
    //     whoseEntranceCode[entranceCodes[player]] = address(0);
    //     playersCounter--;
    //     emit onUnregistering(player, _entranceCounter);

    //     ISport(sport).transfer(player, buyIn);

    //     uint _balance = address(this).balance;
    //     contractBalance = _balance;
    //     prize = _balance * winnerShare / 100;
    //         // In Solidity, division rounds towards zero
    // }

    /// announceWinner stores the winner's address in the contract
    /// and assignes the tournament with the status Winner
    function announceWinner(
        uint256 id,
        address winner1,
        address winner2,
        address winner3
    ) public checkTermination(id) {
        require(
            tournamentList[id].creator == _msgSender(),
            "The creator can only annouce winner."
        );

        tournamentList[id].winner1 = winner1;
        tournamentList[id].winner2 = winner2;
        tournamentList[id].winner3 = winner3;
        tournamentList[id].status = statuses.Winner;
        emit onWinnerAnnouncement(id, winner1, winner2, winner3);
    }

    /// terminate assignes the tournament with one of the statuses
    /// Cancelled or NoWinner
    function terminate(
        address creator,
        uint256 id,
        statuses newStatus
    ) public checkTermination(id) {
        require(
            tournamentList[id].creator == creator,
            "The creator can only cancel tournament."
        );

        require(
            newStatus == statuses.Cancelled || newStatus == statuses.NoWinner,
            "Invalid termination status"
        );

        tournamentList[id].status = newStatus;
        emit onTermination(newStatus);
    }

    /// refund lets the players take away their buy-ins if the tournament
    /// has one of the statuses LackOfPlayers, Cancelled or NoWinner
    // function refund(address player)
    //     public
    // {
    //     int _entranceCounter = entranceCounters[player];
    //     statuses _status = status;

    //     require(
    //         _entranceCounter > 0,
    //         "You are not a player of the tournament"
    //     );
    //     require(
    //         _entranceCounter % 10 == 0,
    //         "You have already refunded"
    //     );
    //     require(
    //         _status == statuses.LackOfPlayers ||
    //         _status == statuses.Cancelled ||
    //         _status == statuses.NoWinner,
    //         "You can refund only if the tournament terminated with no winner"
    //     );
    //     _entranceCounter++;
    //     entranceCounters[player] = _entranceCounter;
    //     emit onRefund(player);

    //     ISport(sport).transfer(player, buyIn);

    //     contractBalance = address(this).balance;
    // }

    /// withdraw assigns the torunament with the status LackOfPlayers if appropriate,
    /// or transfers the requested amount to the organizer if the amount is non-zero
    /// and it does not exceed the available funds

    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }

    function withdraw(address to) public onlyMetaKeepLambdaOwner {
        ISport(sport).transfer(to, address(this).balance);
        emit onWithdrawal(address(this).balance);
    }
}
