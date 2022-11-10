// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import {Result} from "../datastructures/structures.sol";

interface OOInterface {
    function askQuestion(
        string memory questionString,
        string memory resolutionSource,
        uint256 expiry
    ) external;

    function proposeAnswer(bytes32 questionId, Result answer) external;

    function finalizeProposal(bytes32 questionId) external;

    function disputeProposal(bytes32 questionId) external;

    function commitVote(bytes32 questionId, bytes32 commitHash) external;

    function revealVote(
        bytes32 questionId,
        Result _vote,
        string memory password
    ) external;

    function finalizeVote(bytes32 questionId) external;
}
