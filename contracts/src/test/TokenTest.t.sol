// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "forge-std/Test.sol";
import {ERC1155Holder} from "openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {CheatCodes} from "./helpers/CheatCodes.sol";
import {OPTI} from "../Token.sol";

contract OptimisticOracleTest is Test {
    CheatCodes internal cheats;
    OPTI internal opti;

    address internal alice;
    address internal bob;
    address internal john;
    address internal kyle;

    function setUp() public {
        cheats = CheatCodes(HEVM_ADDRESS);
        opti = new OPTI();
        alice = address(new TokenReceiver());
        bob = address(new TokenReceiver());
        john = address(new TokenReceiver());
        kyle = address(new TokenReceiver());
        payable(alice).transfer(1000 ether);
        payable(bob).transfer(1000 ether);
    }

    function testCanMint() public {
        opti.mint(address(this), 1_000_000 ether);
        opti.mint(alice, 1_000_000 ether);
        opti.mint(bob, 1_000_000 ether);
    }

    function testCanApprove() public {
        opti.approve(address(this), type(uint256).max);
        cheats.prank(alice);
        opti.approve(address(this), type(uint256).max);
        cheats.prank(bob);
        opti.approve(address(this), type(uint256).max);
    }
}

contract TokenReceiver is ERC1155Holder {
    receive() external payable {}
}
