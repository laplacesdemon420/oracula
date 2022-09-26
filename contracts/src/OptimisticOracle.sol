// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {OOInterface} from "./interfaces/OOInterface.sol";
import {Result, Stage, Proposal, Question, Vote} from "./datastructures/structures.sol";

contract OptimisticOracle is OOInterface {
    mapping(bytes32 => Question) public questionById;
    mapping(bytes32 => Proposal) public proposalByQuestionId;
    mapping(bytes32 => address) public disputerByQuestionId;
    mapping(bytes32 => Vote) public voteByQuestionId;

    IERC20 public currency;
    uint256 public BOND_AMOUNT;
    uint256 public DISPUTE_PERIOD;
    uint256 public VOTING_PERIOD;

    constructor(address _currency) {
        currency = IERC20(_currency);
        BOND_AMOUNT = 10 ether;
        DISPUTE_PERIOD = 86400; // 24H
        VOTING_PERIOD = 172800; // 48H
    }

    function askQuestion(string memory questionString, uint256 expiry)
        external
    {
        bytes32 questionId = getQuestionId(questionString, expiry);
        Question memory question = Question(
            questionString,
            expiry,
            Stage.PENDING,
            Result.INVALID
        );
        questionById[questionId] = question;
    }

    function proposeAnswer(bytes32 questionId, Result answer) external {
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

    function finalizeProposal(bytes32 questionId) external {
        Proposal memory proposal = proposalByQuestionId[questionId];
        require(
            block.timestamp > proposal.timestamp + DISPUTE_PERIOD,
            "Too early to finalize"
        );
        address disputer = disputerByQuestionId[questionId];
        require(
            disputer == address(0),
            "Proposal was disputed, cannot finalize"
        );

        Question storage question = questionById[questionId];
        question.stage = Stage.FINALIZED;
        question.result = proposal.answer;
    }

    function disputeProposal(bytes32 questionId) external {
        Question storage question = questionById[questionId];
        require(
            question.stage == Stage.PROPOSED,
            "Question cannot be disputed"
        );

        Proposal storage proposal = proposalByQuestionId[questionId];
        require(
            block.timestamp < proposal.timestamp + DISPUTE_PERIOD,
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

        // initialize vote
        initializeVote(questionId);
    }

    function initializeVote(bytes32 questionId) internal {
        Vote memory vote = Vote(0, 0, 0, block.timestamp + VOTING_PERIOD);
        voteByQuestionId[questionId] = vote;
    }

    function makeVote(bytes32 questionId, Result answer) external {
        Vote storage vote = voteByQuestionId[questionId];
        require(
            vote.endTimestamp != 0,
            "There is no ongoing vote for this question."
        );
        require(block.timestamp < vote.endTimestamp, "Voting period has ended");

        if (answer == Result.INVALID) {
            vote.invalidCount += 1;
        } else if (answer == Result.YES) {
            vote.yesCount += 1;
        } else {
            vote.noCount += 1;
        }
    }

    function finalizeVote(bytes32 questionId) external {
        Vote memory vote = voteByQuestionId[questionId];
        require(
            vote.endTimestamp != 0,
            "There is no ongoing vote for this question."
        );
        require(
            block.timestamp > vote.endTimestamp,
            "Voting period has not ended"
        );

        Question storage question = questionById[questionId];
        if (vote.yesCount > vote.noCount && vote.yesCount > vote.invalidCount) {
            question.result = Result.YES;
        } else if (
            vote.yesCount < vote.noCount && vote.noCount > vote.invalidCount
        ) {
            question.result = Result.NO;
        }
        // else: INVALID, which the is the default value

        question.stage = Stage.FINALIZED;
    }

    function getQuestionById(bytes32 questionId)
        external
        view
        returns (Question memory)
    {
        return questionById[questionId];
    }

    function getProposalByQuestionId(bytes32 questionId)
        external
        view
        returns (Proposal memory)
    {
        return proposalByQuestionId[questionId];
    }

    function getQuestionId(string memory questionString, uint256 expiry)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(questionString, expiry));
    }
}
