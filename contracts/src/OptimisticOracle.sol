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
    mapping(bytes32 => mapping(address => bytes32)) public commit;
    bytes32[] public questionIds;

    IERC20 public currency;
    uint256 public BOND_AMOUNT;
    uint256 public DISPUTE_PERIOD;
    uint256 public VOTING_PERIOD;
    uint256 public COMMIT_PHASE;
    uint256 public REVEAL_PHASE;

    constructor(address _currency) {
        currency = IERC20(_currency);
        BOND_AMOUNT = 10 ether; // 10 opti
        DISPUTE_PERIOD = 600; // 10min
        VOTING_PERIOD = 1200; // 20min
        COMMIT_PHASE = 600;
        REVEAL_PHASE = 600;
    }

    function askQuestion(
        string memory questionString,
        string memory resolutionSource,
        uint256 expiry
    ) external {
        // don't allow duplicates?
        bytes32 questionId = getQuestionId(
            questionString,
            resolutionSource,
            expiry
        );
        Question memory question = Question(
            questionString,
            resolutionSource,
            expiry,
            questionId,
            Stage.PENDING,
            Result.INVALID
        );
        questionById[questionId] = question;
        questionIds.push(questionId);
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

        currency.transfer(proposal.proposer, BOND_AMOUNT);
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
        Vote memory vote = Vote(
            0,
            0,
            0,
            0,
            block.timestamp + COMMIT_PHASE,
            block.timestamp + REVEAL_PHASE
        );
        voteByQuestionId[questionId] = vote;
    }

    function commitVote(bytes32 questionId, bytes32 commitHash) external {
        // commit = keccak256(abi.encode(vote, password))
        // generate unique hash, distribute to the public
        Vote storage vote = voteByQuestionId[questionId];
        // 1. verify that we are in the commit period
        require(
            vote.commitEndTimestamp > 0 &&
                vote.commitEndTimestamp > block.timestamp,
            "Not in a commit phase"
        );

        if (commit[questionId][msg.sender] == bytes32(0)) {
            vote.voteCount++;
        }

        commit[questionId][msg.sender] = commitHash;
    }

    function revealVote(
        bytes32 questionId,
        Result _vote,
        string memory password
    ) external {
        // distribute vote to the public, verify that vote and hash match up
        // 1. verify that we are in the reveal period
        Vote storage vote = voteByQuestionId[questionId];

        require(
            vote.revealEndTimestamp > 0 &&
                vote.revealEndTimestamp > block.timestamp,
            "Not in a reveal phase"
        );

        bytes32 commitHash = commit[questionId][msg.sender];

        require(
            keccak256(abi.encode(_vote, password)) == commitHash,
            "Hashes don't match"
        );

        if (_vote == Result.INVALID) {
            vote.invalidCount += 1;
        } else if (_vote == Result.YES) {
            vote.yesCount += 1;
        } else {
            vote.noCount += 1;
        }

        commit[questionId][msg.sender] = bytes32(0); // prevents double counting
    }

    function finalizeVote(bytes32 questionId) external {
        Vote memory vote = voteByQuestionId[questionId];
        require(
            vote.revealEndTimestamp != 0,
            "There is no ongoing vote for this question."
        );
        require(
            block.timestamp > vote.revealEndTimestamp,
            "Voting period has not ended"
        );

        Proposal memory proposal = proposalByQuestionId[questionId];
        address disputer = disputerByQuestionId[questionId];

        Question storage question = questionById[questionId];
        if (vote.yesCount > vote.noCount && vote.yesCount > vote.invalidCount) {
            question.result = Result.YES;
            if (proposal.answer == Result.YES) {
                currency.transfer(proposal.proposer, BOND_AMOUNT * 2);
            } else {
                currency.transfer(disputer, BOND_AMOUNT * 2);
            }
        } else if (
            vote.yesCount < vote.noCount && vote.noCount > vote.invalidCount
        ) {
            question.result = Result.NO;
            if (proposal.answer == Result.NO) {
                currency.transfer(proposal.proposer, BOND_AMOUNT * 2);
            } else {
                currency.transfer(disputer, BOND_AMOUNT * 2);
            }
        } else {
            // INVALID: pay back proposer and disputer, 10 opti each
            currency.transfer(proposal.proposer, BOND_AMOUNT);
            currency.transfer(disputer, BOND_AMOUNT);
        }

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

    function getVoteByQuestionId(bytes32 questionId)
        external
        view
        returns (Vote memory)
    {
        return voteByQuestionId[questionId];
    }

    function getQuestionId(
        string memory questionString,
        string memory resolutionSource,
        uint256 expiry
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(questionString, resolutionSource, expiry));
    }

    function getAllQuestions() public view returns (Question[] memory) {
        Question[] memory questions = new Question[](questionIds.length);
        for (uint256 i = 0; i < questionIds.length; i++) {
            questions[i] = questionById[questionIds[i]];
        }
        return questions;
    }
}
