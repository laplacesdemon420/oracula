// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {OOInterface} from "./interfaces/OOInterface.sol";

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

contract OO is OOInterface {
    mapping(bytes32 => Question) public questionById;
    mapping(bytes32 => Proposal) public proposalByQuestionId;
    mapping(bytes32 => address) public disputerByQuestionId;

    IERC20 public currency;
    uint256 public BOND_AMOUNT;
    uint256 public DISPUTE_PERIOD;

    constructor(address _currency) {
        currency = IERC20(_currency);
        BOND_AMOUNT = 1000 ether;
        DISPUTE_PERIOD = 86400; // 24H
    }

    function askQuestion(string memory questionString, uint256 expiry)
        external
    {
        bytes32 questionId = getQuestionId(questionString, expiry);
        Question memory question = Question(
            questionString,
            expiry,
            Stage.PENDING,
            Result.PENDING
        );
        questionById[questionId] = question;
    }

    function proposeAnswer(bytes32 questionId, uint256 answer) external {
        Question storage question = questionById[questionId];
        require(block.timestamp >= question.expiry, "Not yet at expiry");
        require(
            question.stage == Stage.PENDING,
            "Question already have a proposal"
        );

        proposalByQuestionId[questionId] = Proposal(
            msg.sender,
            answer,
            block.timestamp
        );
        question.stage = Stage.PROPOSED;

        // proposer needs to post a bond
        currency.transferFrom(msg.sender, address(this), BOND_AMOUNT);
    }

    function disputeProposal(bytes32 questionId) external {
        Question storage question = questionById[questionId];
        require(
            question.stage == Stage.PROPOSED,
            "Question cannot be disputed"
        );

        Proposal storage proposal = proposalByQuestionId[questionId];
        require(
            block.timestamp - DISPUTE_PERIOD < proposal.timestamp,
            "too late to dispute"
        );

        question.stage = Stage.DISPUTED;
        disputerByQuestionId[questionId] = msg.sender;

        // disputer needs to post a bond
        currency.transferFrom(msg.sender, address(this), BOND_AMOUNT);

        // at this moment
        // - a question exist
        // - a proposal exist (with bond posted by proposer)
        // - a dispute exist (with bond posted by disputer)
        // we can get everything we need by the questionId

        // send question to the DVM
    }

    function getQuestionId(string memory questionString, uint256 expiry)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(questionString, expiry));
    }
}
