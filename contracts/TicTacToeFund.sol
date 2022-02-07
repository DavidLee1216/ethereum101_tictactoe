// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicTacToeFund is Ownable {
    address public Owner;
    mapping(address => uint32) public customerCredit;
    uint256 priceOfCredit = 0.001 ether;
    event Consume(address indexed user, uint32 indexed credits, string message);

    constructor() {
        Owner = msg.sender;
    }

    function depositMoney() public payable {
        require(
            msg.value >= priceOfCredit,
            "You need to deposit some amount of money more than 0.001 ether!"
        );
        customerCredit[msg.sender] += uint32(msg.value / priceOfCredit);
        payable(msg.sender).transfer(msg.value % priceOfCredit);
    }

    function consumeCredit() public {
        require(
            customerCredit[msg.sender] > 0,
            "Please charge credits before playing"
        );
        customerCredit[msg.sender] -= 1;
        if (customerCredit[msg.sender] == 0)
            emit Consume(
                msg.sender,
                0,
                "You need to charge credits before play the next game"
            );
        else
            emit Consume(
                msg.sender,
                customerCredit[msg.sender],
                "Consumed one credit"
            );
    }

    function withDrawMoney(address payable _to) public payable onlyOwner {
        require(address(this).balance > 0, "Insufficient balance.");
        _to.transfer(address(this).balance);
    }

    function getCustomerCredit() external view returns (uint256) {
        return customerCredit[msg.sender];
    }

    function getFundBalance() public view returns (uint256) {
        require(
            msg.sender == Owner,
            "You must be the owner of the bank to see all balances."
        );
        return address(this).balance;
    }
}
