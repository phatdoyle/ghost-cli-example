
## Contracts: 

`forge init contracts`
`cd contracts`
`forge install OpenZeppelin/openzeppelin-contracts`

update foundry.toml: `remappings = ['@openzeppelin/=lib/openzeppelin-contracts/']`
`forge remappings > remappings.txt`

deploy contract
`forge create src/Counter.sol:Counter --rpc-url $RPC_URL --chain-id 1301 --private-key $PRIVATE_KEY`


 Now lets make a few calls to our contract so we can have some event data later for indexing. 

 cast send 0x75bFf0145E174CEF98Db92b227377C82fE19e137 "increment()" --rpc-url $RPC_URL --private-key $PRIVATE_KEY

-----------------------

## Ghost Graph 

