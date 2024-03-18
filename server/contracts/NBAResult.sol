pragma solidity ^0.8.3;
// SPDX-License-Identifier: UNLICENSED

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract NBAGameResult is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 public gameResult;
    address private oracleAddress;
    bytes32 private jobId;
    uint256 private fee;
    address private LINK = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;

    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(LINK);
        setOracleAddress(0xa57f0cEd49bB1ed7327f950B12a8419cFD01855f);
        setJobId("a8356f48569c434eaa4ac5fcb4db5cc0");
        setFeeInHundredthsOfLink(0);     // 0 LINK
    }

    function requestGameResult(string memory _gameId) public {
        // Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        Chainlink.Request memory req = buildOperatorRequest(jobId, this.fulfill.selector);

        req.add('method', 'GET');
        req.add('url', 'https://61cd-116-98-62-179.ngrok-free.app/api/nba-result?gameId=1057946&betId=140');
        req.add('headers', '["content-type", "application/json", "set-cookie", "sid=14A52"]');
        req.add('body', '');
        req.add('contact', '');
        req.add('path', 'data,result');
        req.addInt('multiplier', 10 ** 18);

        sendOperatorRequest(req, fee);
    }

    function fulfill(bytes32 _requestId, uint256 _gameResult) public recordChainlinkFulfillment(_requestId) {
        gameResult = _gameResult;
    }

    // Update oracle address
    function setOracleAddress(address _oracleAddress) public onlyOwner {
        oracleAddress = _oracleAddress;
        setChainlinkOracle(_oracleAddress);
    }
    function getOracleAddress() public view onlyOwner returns (address) {
        return oracleAddress;
    }

    // Update jobId
    function setJobId(string memory _jobId) public onlyOwner {
        jobId = bytes32(bytes(_jobId));
    }
    function getJobId() public view onlyOwner returns (string memory) {
        return string(abi.encodePacked(jobId));
    }
    
    // Update fees
    function setFeeInJuels(uint256 _feeInJuels) public onlyOwner {
        fee = _feeInJuels;
    }
    function setFeeInHundredthsOfLink(uint256 _feeInHundredthsOfLink) public onlyOwner {
        setFeeInJuels((_feeInHundredthsOfLink * LINK_DIVISIBILITY) / 100);
    }
    function getFeeInHundredthsOfLink() public view onlyOwner returns (uint256) {
        return (fee * 100) / LINK_DIVISIBILITY;
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}