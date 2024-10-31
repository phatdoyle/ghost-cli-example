// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./gen_schema.sol";
import "./gen_events.sol";
import "./gen_base.sol";
import "./gen_helpers.sol";

contract MyIndex is GhostGraph {
    using StringHelpers for EventDetails;
    using StringHelpers for uint256;
    using StringHelpers for address;
    
    function registerHandles() external {
    	graph.registerHandle(0xEC87E4C8Ac38Ff4ECe7D0E36CdBDF42c39FcE903);
    }
    
    function onnumberChanged(EventDetails memory details, numberChangedEvent memory ev) external {
        string memory numberChangedId = details.uniqueId();
        NumberChanged memory numberChanged = graph.getNumberChanged(numberChangedId);
        numberChanged.txHash = details.transactionHash;
        numberChanged.blockNumber = details.block; 
        numberChanged.timestamp = details.timestamp;
        numberChanged.newNumber = ev.newNumber;
        numberChanged.transferId = details.transactionHash; 
        graph.saveNumberChanged(numberChanged);
    }
    
    
    function onTransfer(EventDetails memory details, TransferEvent memory ev) external {

        //Populate our Transfers struct. 
        // bytes32 memory transferId = details.transactionHash; 
        Transfer memory transfer = graph.getTransfer(details.transactionHash); 
        transfer.id = details.transactionHash;
        transfer.from = ev.from;
        transfer.to = ev.to;
        transfer.value = ev.value;
        transfer.txHash = details.transactionHash;
        transfer.blockNumber = details.block;
        transfer.timestamp = details.timestamp;
        graph.saveTransfer(transfer);



        //Populate our Global Struct; 
        GlobalMetrics memory globalMetrics = graph.getGlobalMetrics("1");
        if (ev.from == address(0)){
            //We can populate our Global struct anytime a Mint happens. 
            //This only occurs when our sender is the 0 address. 
            globalMetrics.totalCalls += 1; 
            globalMetrics.totalSupply += ev.value; 
            graph.saveGlobalMetrics(globalMetrics);
        }
        
    }

}