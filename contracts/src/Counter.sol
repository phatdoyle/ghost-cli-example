// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Counter is ERC20, Ownable {
    uint256 public number;

    event numberChanged(uint256 newNumber);
    event numberReset(bool); 
    
    constructor() ERC20("midwit", "MID") Ownable(msg.sender) payable {
        number = 100; 
    }

    function increment() public {
        number++;
        _mint(msg.sender, 100e18); 
        emit numberChanged(number);
    }

    function decrement() public {
        require(number > 0, 'Can decrement below zero');
        number--;
        _mint(msg.sender, 100e18); 
        emit numberChanged(number);
    }

    function resetNumber() public onlyOwner  {
        number = 0; 
        emit numberReset(true);
    }

}
