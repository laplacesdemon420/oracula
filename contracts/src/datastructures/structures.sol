// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

enum Result {
    PENDING,
    YES,
    NO
}

enum Stage {
    PENDING,
    PROPOSED,
    DISPUTED
}

struct Proposal {
    address proposer;
    uint256 answer; // 0 is no, 1 is yes
    uint256 timestamp;
}

struct Question {
    string questionString;
    uint256 expiry;
    Stage stage;
    Result result;
}
