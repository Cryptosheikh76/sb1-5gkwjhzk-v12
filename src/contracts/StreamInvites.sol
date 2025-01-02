// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract StreamInvites {
    mapping(bytes32 => bool) public invites;
    mapping(address => uint256) public creatorBalances;
    
    event InviteCreated(bytes32 indexed inviteHash, address creator);
    event InviteUsed(bytes32 indexed inviteHash, address user);
    event PaymentReceived(address indexed creator, uint256 amount);
    
    function createInvite(bytes32 inviteHash) external {
        require(!invites[inviteHash], "Invite already exists");
        invites[inviteHash] = true;
        emit InviteCreated(inviteHash, msg.sender);
    }
    
    function useInvite(bytes32 inviteHash) external {
        require(invites[inviteHash], "Invalid invite");
        invites[inviteHash] = false;
        emit InviteUsed(inviteHash, msg.sender);
    }
    
    function tip(address creator) external payable {
        require(msg.value > 0, "Must send some ETH");
        creatorBalances[creator] += msg.value;
        emit PaymentReceived(creator, msg.value);
    }
    
    function withdraw() external {
        uint256 amount = creatorBalances[msg.sender];
        require(amount > 0, "No balance to withdraw");
        creatorBalances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}