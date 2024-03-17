pragma solidity ^0.8.3;
// SPDX-License-Identifier: UNLICENSED

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract NBAGameResult is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 public gameResult;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    constructor(address _oracle, string memory _jobId, uint256 _fee) {
        setPublicChainlinkToken();
        oracle = _oracle;
        jobId = stringToBytes32(_jobId);
        fee = _fee;
    }

    function requestGameResult(string memory _gameId) public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        string memory url = string(abi.encodePacked('https://livescore6.p.rapidapi.com/matches/v2/get-scoreboard?Category=basketball&Eid=', _gameId));
        request.add('method', 'GET');
        request.add('url', url);
        request.add('headers', '["X-RapidAPI-Host", "livescore6.p.rapidapi.com", "X-RapidAPI-Key", "fbdda89d74msh7b990edc2ea51eep1bcd58jsn73008d56b75f"]');

        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function fulfill(bytes32 _requestId, uint256 _gameResult) public recordChainlinkFulfillment(_requestId) {
        gameResult = _gameResult;
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
}