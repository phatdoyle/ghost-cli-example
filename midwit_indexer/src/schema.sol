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
    @many(NumberChanged.transferId) numberChanges;
}

struct NumberChanged {
    string id; 
    bytes32 txHash;
    uint64 blockNumber;
    uint32 timestamp;
    uint256 newNumber;
    @belongsTo(Transfer.id) transferId;
}


