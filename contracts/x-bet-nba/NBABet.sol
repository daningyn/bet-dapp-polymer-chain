//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "../base/CustomChanIbcApp.sol";

contract NBABet is CustomChanIbcApp {
    enum IbcPacketStatus {
        UNSENT,
        SENT,
        ACKED,
        TIMEOUT
    }

    struct Bet {
        uint256 betAmount;
        uint predictedTeam; // Predicted Team (1 for Team A, 2 for Team B)
        uint256 betRate;
        uint256 betTime;
        IbcPacketStatus ibcPacketStatus;
        uint betNFTId;
    }

    mapping(uint256 => mapping(address => bool)) public hasBet;

    mapping(uint256 => mapping(address => Bet)) public betsOf;

    // Event emitted when a new bet is placed
    event BetPlaced(
        uint256 matchId,
        address user,
        uint predictedTeam,
        uint256 betAmount,
        uint256 betRate,
        uint256 betTime
    );

    event SendBetInfo(bytes32 channelId, address betUser, uint256 matchId);
    event AckNFTMint(
        bytes32 channelId,
        uint sequence,
        address sender,
        uint256 matchId,
        uint betNFTId
    );

    address public chairperson;

    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Not chairperson.");
        _;
    }

    constructor(IbcDispatcher _dispatcher) CustomChanIbcApp(_dispatcher) {
        chairperson = msg.sender;
    }

    function placeBet(
        uint256 _matchId,
        uint256 _amount,
        uint _predictedTeam,
        uint256 _betRate
    ) external payable {
        // require(_matchId < matches.length, "Invalid match ID");
        require(_amount > 0, "Bet amount must be greater than 0");
        require(
            _predictedTeam == 1 || _predictedTeam == 2,
            "Invalid predicted Team"
        );
        require(
            !hasBet[_matchId][msg.sender],
            "You have already placed a bet on this match"
        );
        // Transfer the specified bet amount to the contract
        // payable(msg.sender).transfer(_amount);

        Bet storage bet = betsOf[_matchId][msg.sender];
        bet.ibcPacketStatus = IbcPacketStatus.UNSENT;
        bet.betAmount = _amount;
        bet.predictedTeam = _predictedTeam;
        bet.betRate = _betRate;
        bet.betTime = block.timestamp;

        // Update the mapping
        hasBet[_matchId][msg.sender] = true;

        emit BetPlaced(
            _matchId,
            msg.sender,
            _amount,
            _predictedTeam,
            _betRate,
            bet.betTime
        );
    }

    function sendPacket(
        bytes32 channelId,
        uint64 timeoutSeconds,
        address senderAddress,
        uint256 matchId
    ) external {
        Bet storage bet = betsOf[matchId][senderAddress];
        require(
            bet.ibcPacketStatus == IbcPacketStatus.UNSENT ||
                bet.ibcPacketStatus == IbcPacketStatus.TIMEOUT,
            "An IBC packet relating to his bet has already been sent. Wait for acknowledgement."
        );

        bytes memory payload = abi.encode(
            senderAddress,
            matchId,
            bet.betAmount,
            bet.predictedTeam,
            bet.betRate,
            bet.betTime
        );

        uint64 timeoutTimestamp = uint64(
            (block.timestamp + timeoutSeconds) * 1000000000
        );

        dispatcher.sendPacket(channelId, payload, timeoutTimestamp);
        bet.ibcPacketStatus = IbcPacketStatus.SENT;

        emit SendBetInfo(channelId, senderAddress, matchId);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // -------------- IBC ---------------
    function onRecvPacket(
        IbcPacket memory
    )
        external
        view
        override
        onlyIbcDispatcher
        returns (AckPacket memory ackPacket)
    {
        require(false, "This function should not be called");

        return
            AckPacket(
                true,
                abi.encode("Error: This function should not be called")
            );
    }

    function onAcknowledgementPacket(
        IbcPacket calldata packet,
        AckPacket calldata ack
    ) external override onlyIbcDispatcher {
        ackPackets.push(ack);

        // // decode the ack data, find the address of the voter the packet belongs to and set ibcNFTMinted true
        (address sender, uint256 matchId, uint256 betNFTId) = abi.decode(
            ack.data,
            (address, uint256, uint256)
        );
        betsOf[matchId][sender].ibcPacketStatus = IbcPacketStatus.ACKED;
        betsOf[matchId][sender].betNFTId = betNFTId;

        emit AckNFTMint(
            packet.src.channelId,
            packet.sequence,
            sender,
            matchId,
            betNFTId
        );
    }

    function onTimeoutPacket(
        IbcPacket calldata packet
    ) external override onlyIbcDispatcher {
        timeoutPackets.push(packet);
        // do logic
    }
}
