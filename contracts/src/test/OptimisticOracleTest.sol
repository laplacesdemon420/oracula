// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "forge-std/Test.sol";
import {ERC1155Holder} from "openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {CheatCodes} from "./helpers/CheatCodes.sol";
import {OPTI} from "./helpers/MockERC20.sol";
import {OptimisticOracle} from "../OptimisticOracle.sol";
import {Result, Stage, Proposal, Question, Vote} from "../datastructures/structures.sol";

contract OptimisticOracleTest is Test {
    OptimisticOracle internal oo;
    CheatCodes internal cheats;
    OPTI internal opti;

    address internal alice;
    address internal bob;
    address internal john;
    address internal kyle;

    function setUp() public {
        cheats = CheatCodes(HEVM_ADDRESS);
        opti = new OPTI();
        oo = new OptimisticOracle(address(opti));
        alice = address(new TokenReceiver());
        bob = address(new TokenReceiver());
        john = address(new TokenReceiver());
        kyle = address(new TokenReceiver());
        payable(alice).transfer(1000 ether);
        payable(bob).transfer(1000 ether);

        opti.mint(address(this), 1_000_000 ether);
        opti.mint(alice, 1_000_000 ether);
        opti.mint(bob, 1_000_000 ether);

        opti.approve(address(oo), type(uint256).max);
        cheats.prank(alice);
        opti.approve(address(oo), type(uint256).max);
        cheats.prank(bob);
        opti.approve(address(oo), type(uint256).max);
    }

    function testQuestionHappyPath() public {
        // ASK QUESTION
        oo.askQuestion(
            "will ETH be over 1k tomorrow?",
            "https://coingecko.com",
            1000
        );
        bytes32 questionId = oo.getQuestionId(
            "will ETH be over 1k tomorrow?",
            "https://coingecko.com",
            1000
        );
        Question memory question = oo.getQuestionById(questionId);
        assertEq(question.questionString, "will ETH be over 1k tomorrow?");

        // PROPOSE ANSWER
        cheats.warp(1000);
        uint256 initialBalance = opti.balanceOf(address(this));
        oo.proposeAnswer(questionId, Result.YES); // 1 is yes
        assertEq(initialBalance, opti.balanceOf(address(this)) + 10 ether); // 10 OPTI proposal bond

        Proposal memory proposal = oo.getProposalByQuestionId(questionId);
        assertEq(uint256(proposal.answer), uint256(Result.YES));

        // FINALIZE PROPOSAL
        cheats.warp(oo.DISPUTE_PERIOD() + 1001);
        oo.finalizeProposal(questionId);
        question = oo.getQuestionById(questionId);
        assertEq(uint256(question.stage), uint256(Stage.FINALIZED));
        assertEq(uint256(question.result), uint256(proposal.answer));

        Question[] memory questions = oo.getAllQuestions();
        question = oo.getQuestionById(questionId);

        assertEq(uint256(questions[0].result), uint256(question.result));

        uint256 endingBalance = opti.balanceOf(address(this));

        assertEq(endingBalance, initialBalance);
    }

    function testQuestionSadPath() public {
        // ASK QUESTION
        oo.askQuestion(
            "will ETH be over 1k tomorrow?",
            "https://coingecko.com",
            1000
        );
        bytes32 questionId = oo.getQuestionId(
            "will ETH be over 1k tomorrow?",
            "https://coingecko.com",
            1000
        );
        Question memory question = oo.getQuestionById(questionId);
        assertEq(question.questionString, "will ETH be over 1k tomorrow?");

        // PROPOSE ANSWER
        cheats.warp(1000);
        uint256 initialBalance = opti.balanceOf(address(this));
        oo.proposeAnswer(questionId, Result.YES); // 1 is yes
        assertEq(initialBalance, opti.balanceOf(address(this)) + 10 ether); // 10 OPTI proposal bond

        Proposal memory proposal = oo.getProposalByQuestionId(questionId);
        assertEq(uint256(proposal.answer), uint256(Result.YES));

        // DISPUTE PROPOSAL
        uint256 bobInitialBalance = opti.balanceOf(bob);
        cheats.prank(bob);
        oo.disputeProposal(questionId);
        assertEq(bobInitialBalance, opti.balanceOf(bob) + 10 ether); // 10 OPTI dispute bond

        // FINALIZATION FAILS
        cheats.warp(oo.DISPUTE_PERIOD() + 1001);
        cheats.expectRevert("Proposal was disputed, cannot finalize");
        oo.finalizeProposal(questionId);
        cheats.warp(1000);

        // COMMIT VOTES
        cheats.prank(alice);
        oo.commitVote(
            questionId,
            keccak256(abi.encode(Result.YES, "alice-password"))
        );
        cheats.prank(bob);
        oo.commitVote(
            questionId,
            keccak256(abi.encode(Result.NO, "bob-password"))
        );
        cheats.prank(john);
        oo.commitVote(
            questionId,
            keccak256(abi.encode(Result.NO, "john-password"))
        );
        cheats.prank(kyle);
        oo.commitVote(
            questionId,
            keccak256(abi.encode(Result.YES, "kyle-password"))
        );
        cheats.prank(kyle); // can change vote
        oo.commitVote(
            questionId,
            keccak256(abi.encode(Result.NO, "kyle-password"))
        );

        Vote memory vote = oo.getVoteByQuestionId(questionId);
        assertEq(vote.voteCount, 4);

        // REVEAL VOTES
        // test cannot reveal with wrong password
        cheats.prank(alice);
        cheats.expectRevert("Hashes don't match");
        oo.revealVote(questionId, Result.YES, "alice-password-wrong");

        cheats.prank(alice);
        oo.revealVote(questionId, Result.YES, "alice-password");
        cheats.prank(bob);
        oo.revealVote(questionId, Result.NO, "bob-password");
        // test cannot reveal twice
        cheats.prank(bob);
        cheats.expectRevert("Hashes don't match");
        oo.revealVote(questionId, Result.NO, "bob-password");

        cheats.prank(john);
        oo.revealVote(questionId, Result.NO, "john-password");
        cheats.prank(kyle);
        oo.revealVote(questionId, Result.NO, "kyle-password");

        vote = oo.getVoteByQuestionId(questionId);
        assertEq(vote.yesCount, 1);
        assertEq(vote.noCount, 3);

        // FINALIZE VOTE
        cheats.warp(oo.VOTING_PERIOD() + 1001);
        oo.finalizeVote(questionId);
        question = oo.getQuestionById(questionId);
        assertEq(uint256(question.stage), uint256(Stage.FINALIZED));
        assertEq(uint256(question.result), uint256(Result.NO));

        uint256 bobEndingBalance = opti.balanceOf(bob);
        assertEq(bobEndingBalance, bobInitialBalance + 10 ether);

        uint256 endingBalance = opti.balanceOf(address(this));
        assertEq(endingBalance, initialBalance - 10 ether);
    }

    function testCannotVoteTwice() public {}
}

contract TokenReceiver is ERC1155Holder {
    receive() external payable {}
}
