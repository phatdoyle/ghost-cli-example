
## Contracts: 

`forge init contracts`
`cd contracts`
`forge install OpenZeppelin/openzeppelin-contracts`

update foundry.toml: `remappings = ['@openzeppelin/=lib/openzeppelin-contracts/']`
`forge remappings > remappings.txt`

deploy contract
`forge create src/Counter.sol:Counter --rpc-url $RPC_URL --chain-id 1301 --private-key $PRIVATE_KEY`


 Now lets make a few calls to our contract so we can have some event data later for indexing. Using Cast we can call function on our contract from the terminal.  This will help us generate some event data to start indexing.  Play around with cast if you need to seed some data for indexing. 

Lets call increment 30 times. 
```
for i in {1..30}; do
  cast send 0xEC87E4C8Ac38Ff4ECe7D0E36CdBDF42c39FcE903 "increment()" --rpc-url $RPC_URL --private-key $PRIVATE_KEY
done
```

Lets call decrement 13 times. 
```
for i in {1..13}; do
  cast send 0xEC87E4C8Ac38Ff4ECe7D0E36CdBDF42c39FcE903 "decrement()" --rpc-url $RPC_URL --private-key $PRIVATE_KEY
done
```

I will also transfer some tokens to an address to get a few more transfer events and more holders. 
```
for i in {1..13}; do
  cast send 0xEC87E4C8Ac38Ff4ECe7D0E36CdBDF42c39FcE903 "transfer(address,uint256)" 0x20ae6728381Fb6C852de87A84A3F6b1B0995c304 10000000000000000000 --rpc-url $RPC_URL --private-key $PRIVATE_KEY
done
```


We will now have some `transfer` data, some `numberUpdated` events that we can start indexing. 

-----------------------

## Ghost Graph 

Install GhostCLI https://github.com/tryghostxyz/ghost-cli 

Make sure you create a ghost API and follow along on 