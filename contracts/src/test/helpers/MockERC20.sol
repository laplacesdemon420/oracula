// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract OPTI is ERC20 {
    constructor() ERC20("OPTI", "OPTI") {}

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
