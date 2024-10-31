/** AUTOGENERATED CODE BY GHOSTGRAPH CODEGEN **/

// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

struct GlobalMetrics {
    string id;
    uint256 totalCalls;
    uint256 totalSupply;
}

struct Transfer {
    bytes32 id;
    address from;
    address to;
    uint256 value;
    bytes32 txHash;
    uint64 blockNumber;
    uint32 timestamp;
}

struct NumberChanged {
    string id;
    bytes32 txHash;
    uint64 blockNumber;
    uint32 timestamp;
    uint256 newNumber;
    bytes32 transferId;
}