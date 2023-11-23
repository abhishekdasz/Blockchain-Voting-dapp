// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;
    bool public votingOpen;

    struct Candidate {
        string name;
        uint256 age;
        string candidateAddress;
        string party;
        uint256 voteCount;
    }

    struct Voter {
        string name;
        uint256 age;
        bool hasVoted;
    }

    mapping(address => Voter) public voters;
    mapping(address => bool) public hasRegistered;

    Candidate[] public candidates;
    address[] public votersByIndex;
    uint256 public votingStart;
    uint256 public votingEnd;

    uint256 public totalVoters;
    string public winnerName;

    modifier onlyAdmin {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    modifier onlyVoter {
        require(hasRegistered[msg.sender], "Only registered voters can call this function");
        _;
    }

    modifier onlyDuringVotingPeriod {
        require(isVotingOpen(), "Voting is not currently open");
        _;
    }

    modifier hasNotVoted {
        require(!voters[msg.sender].hasVoted, "You have already voted");
        _;
    }

    modifier votingEnded {
        require(block.timestamp >= votingEnd, "Voting has not ended yet");
        _;
    }

    constructor(uint256 _durationInMinutes, address _admin) {
        require(_durationInMinutes > 0, "Voting duration must be greater than zero");

        admin = _admin;
        votingStart = 0;
        votingEnd = 0;
        votingOpen = false;
    }

    function startVoting(uint256 _durationInMinutes) public onlyAdmin {
        require(!votingOpen, "Voting is already open");
        require(block.timestamp >= votingEnd, "Voting from the previous period has not ended yet");

        votingStart = block.timestamp;
        require(votingStart > 0, "Voting has not started yet");
        require(_durationInMinutes > 0, "Voting duration must be greater than zero");

        votingEnd = votingStart + (_durationInMinutes * 1 minutes);
        votingOpen = true;
    }

    function resetVotingEnd() internal {
        votingEnd = 0;
        votingOpen = false;
    }

    function endVoting() public onlyAdmin onlyDuringVotingPeriod {
        // Call the internal function to reset votingEnd
        resetVotingEnd();
    }

    function declareResult() public onlyAdmin votingEnded {
        // Call the internal function to reset votingEnd
        resetVotingEnd();

        // Set the winner details
        (winnerName, ) = getWinner();

        // Emit the event to log the winner's name and votes for all candidates
        emit WinnerDeclared(winnerName, candidates);
    }

    // Event to log the winner's name
    event WinnerDeclared(string winnerName, Candidate[] candidates);

    function getWinner() public view returns (string memory, Candidate[] memory) {
        // Initialize variables to keep track of the winning candidate and their votes
        uint256 winningVoteCount = 0;
        string memory winningCandidateName;

        // Iterate through all candidates to find the winner
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateName = candidates[i].name;
            }
        }

        // Return the winner's name and votes for all candidates
        return (winningCandidateName, candidates);
    }

    function registerVoter(string memory _name, uint256 _age) public {
        require(!hasRegistered[msg.sender], "Voter is already registered");

        voters[msg.sender] = Voter({
            name: _name,
            age: _age,
            hasVoted: false
        });

        hasRegistered[msg.sender] = true;
        votersByIndex.push(msg.sender);

        totalVoters++;
    }

    function addCandidate(string memory _name, uint256 _age, string memory _party, string memory _candidateAddress) public onlyAdmin {
        candidates.push(Candidate({
            name: _name,
            age: _age,
            party: _party,
            candidateAddress: _candidateAddress,
            voteCount: 0
        }));
    }

    function vote(uint256 _candidateIndex) public onlyVoter onlyDuringVotingPeriod hasNotVoted {
        require(_candidateIndex < candidates.length, "Invalid candidate index");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender].hasVoted = true;
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getAllVoters() public view returns (Voter[] memory) {
        Voter[] memory allVoters = new Voter[](totalVoters);

        for (uint256 i = 0; i < totalVoters; i++) {
            address voterAddress = votersByIndex[i];
            allVoters[i] = voters[voterAddress];
        }

        return allVoters;
    }

    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }

    function getVotingStatus() public view returns (bool) {
        return isVotingOpen();
    }

    function getRemainingTime() public view returns (uint256) {
        if (votingStart == 0) {
            return 0;
        }

        if (block.timestamp >= votingEnd) {
            return 0;
        }

        return votingEnd - block.timestamp;
    }

    function isVotingOpen() public view returns (bool) {
        return votingOpen;
    }

    function showTotalVoters() public view returns (uint256) {
        return totalVoters;
    }

    function isRegisteredVoter() public view returns (bool) {
        return hasRegistered[msg.sender];
    }

    function isAdmin() public view returns (bool) {
        return msg.sender == admin;
    }
}
