// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;
pragma solidity >=0.4.22 <0.9.0;

contract Voting {
    struct Vote {
        string voterId;
        string candidateId;
        string partyName;
        string date;
    }

    // Mapping to track votes per candidate
    mapping(string => uint256) public votesPerCandidate;
    
    // Mapping to track unique voters
    mapping(string => bool) public hasVoted;
    
    // Total voters count
    uint256 public totalVoters;

    // Event to emit when a vote is cast
    event VoteCast(string voterId, string candidateId, string partyName, string date);

    function castVote(string memory _voterId, string memory _candidateId, string memory _partyName, string memory _date) public returns (bool){
        //  bytes32 voterHash = keccak256(abi.encodePacked(_voterId));
    // bytes32 candidateHash = keccak256(abi.encodePacked(_candidateId));
        require(!hasVoted[_voterId], "Voter has already voted!");

        // Mark voter as voted
        hasVoted[_voterId] = true;
        totalVoters++;

        // Increment vote count for the candidate
        votesPerCandidate[_candidateId]++;

        // Emit event for vote tracking
        emit VoteCast(_voterId, _candidateId, _partyName, _date);
        return true;
    }

    // Get number of votes for a candidate
    function getVotesForCandidate(string memory _candidateId) public view returns (uint256) {
        //  bytes32 candidateHash = keccak256(abi.encodePacked(_candidateId)); // Convert input string to bytes32
        return votesPerCandidate[_candidateId];
    }
    function voterStatus(string memory _voterId) public view returns (bool) {
        //  bytes32 voterHash = keccak256(abi.encodePacked(_voterId)); // Convert input string to bytes32
        return hasVoted[_voterId];
    }
    // Get total number of voters participated
    function getTotalVoters() public view returns (uint256) {
        return totalVoters;
    }
}
