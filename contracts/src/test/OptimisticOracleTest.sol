// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "forge-std/Test.sol";
import {ERC1155Holder} from "openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {CheatCodes} from "./helpers/CheatCodes.sol";
import {OPTI} from "./helpers/MockERC20.sol";
import {OptimisticOracle} from "../OptimisticOracle.sol";
import {Result, Stage, Proposal, Question} from "../datastructures/structures.sol";

contract OptimisticOracleTest is Test {
    OptimisticOracle internal oo;
    CheatCodes internal cheats;
    OPTI internal opti;

    address internal alice;
    address internal bob;

    function setUp() public {
        cheats = CheatCodes(HEVM_ADDRESS);
        opti = new OPTI();
        oo = new OptimisticOracle(address(opti));
        alice = address(new TokenReceiver());
        bob = address(new TokenReceiver());
        payable(alice).transfer(1000 ether);
        payable(bob).transfer(1000 ether);

        opti.mint(address(this), 1_000_000 ether);
        opti.mint(alice, 1_000_000 ether);
        opti.mint(bob, 1_000_000 ether);

        opti.approve(address(opti), type(uint256).max);
        cheats.prank(alice);
        opti.approve(address(opti), type(uint256).max);
        cheats.prank(bob);
        opti.approve(address(opti), type(uint256).max);
    }

    function testAskQuestion() public {
        oo.askQuestion("will ETH be over 1k tomorrow?", 1000);
        Question memory question = oo.getQuestionById(
            oo.getQuestionId("will ETH be over 1k tomorrow?", 1000)
        );

        assertEq(question.questionString, "will ETH be over 1k tomorrow?");
    }
}

contract TokenReceiver is ERC1155Holder {
    receive() external payable {}
}
