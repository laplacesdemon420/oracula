// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

enum Result {
    INVALID,
    YES,
    NO
}

enum Stage {
    PENDING,
    PROPOSED,
    DISPUTED,
    FINALIZED
}

struct Proposal {
    address proposer;
    Result answer; // 0 is invalid, 1 is yes, 2 is no
    uint256 timestamp;
}

struct Vote {
    uint256 invalidCount;
    uint256 yesCount;
    uint256 noCount;
    uint256 endTimestamp;
}

struct Question {
    string questionString;
    string resolutionSource;
    uint256 expiry;
    Stage stage;
    Result result;
}
