// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

interface OOInterface {
    // ask question
    function askQuestion(string memory questionString, uint256 expiry) external;
    // propose answer
    // dispute answer
}

interface DVMInterface {
    // initialize vote
    // commit vote
    // reveal vote
    // aggregate votes
}
