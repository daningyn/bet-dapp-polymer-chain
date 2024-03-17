//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../base/CustomChanIbcApp.sol";

contract XProofOfBetNFT is ERC721, ERC721Burnable, CustomChanIbcApp {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    string baseURI;
    string private suffix = "/500/500";

    struct Bet {
        uint256 betAmount;
        uint predictedTeam; // Predicted Team (1 for Team A, 2 for Team B)
        uint256 betRate;
        uint256 betTime;
        uint betNFTId;
    }

    mapping(uint256 => mapping(address => Bet)) public betsOf;

    event MintedOnRecv(
        bytes32 channelId,
        uint64 sequence,
        address indexed sender,
        uint256 matchId,
        uint betNFTId
    );

    constructor(
        IbcDispatcher _dispatcher,
        string memory _baseURI
    ) CustomChanIbcApp(_dispatcher) ERC721("ProofOfBetNFT", "Bet") {
        baseURI = _baseURI;
    }

    function mint(address recipient) internal returns (uint256) {
        currentTokenId.increment();
        uint256 tokenId = currentTokenId.current();
        _safeMint(recipient, tokenId);
        return tokenId;
    }

    function checkBet(uint256 matchId) public {}

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return
            string(
                abi.encodePacked(baseURI, Strings.toString(tokenId), suffix)
            );
    }

    function updateBaseURI(string memory _newBaseURI) public {
        baseURI = _newBaseURI;
    }

    // IBC methods

    // This contract only receives packets from the IBC dispatcher

    function onRecvPacket(
        IbcPacket memory packet
    ) external override onlyIbcDispatcher returns (AckPacket memory ackPacket) {
        recvedPackets.push(packet);

        // Decode the packet data
        (
            address senderAddress,
            uint256 matchId,
            uint256 betAmount,
            uint predictedTeam,
            uint256 betRate,
            uint256 betTime
        ) = abi.decode(
                packet.data,
                (address, uint256, uint256, uint, uint256, uint256)
            );

        // Mint the NFT
        uint256 betNFTId = mint(senderAddress);
        // Save Bet
        Bet storage bet = betsOf[matchId][msg.sender];
        bet.betAmount = betAmount;
        bet.predictedTeam = predictedTeam;
        bet.betRate = betRate;
        bet.betTime = betTime;
        bet.betNFTId = betNFTId;
        emit MintedOnRecv(
            packet.dest.channelId,
            packet.sequence,
            senderAddress,
            matchId,
            betNFTId
        );

        // Encode the ack data
        bytes memory ackData = abi.encode(senderAddress, matchId, betNFTId);

        return AckPacket(true, ackData);
    }

    function onAcknowledgementPacket(
        IbcPacket calldata,
        AckPacket calldata
    ) external view override onlyIbcDispatcher {
        require(
            false,
            "This contract should never receive an acknowledgement packet"
        );
    }

    function onTimeoutPacket(
        IbcPacket calldata
    ) external view override onlyIbcDispatcher {
        require(false, "This contract should never receive a timeout packet");
    }
}
