
interface Events {
    event numberChanged(uint256 newNumber);
    event numberReset(bool numberReset); 
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
}