// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;

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
    bool public resultDeclared;

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

    modifier resultNotDeclared {
        require(!resultDeclared, "Result has already been declared");
        _;
    }

    constructor(uint256 _durationInMinutes, address _admin) {
        require(_durationInMinutes > 0, "Voting duration must be greater than zero");

        admin = _admin;
        votingStart = 0;
        votingEnd = 0;
        resultDeclared = false;
    }

    function startVoting(uint256 _durationInMinutes) public onlyAdmin resultNotDeclared {
        require(block.timestamp >= votingEnd, "Voting from the previous period has not ended yet");

        votingStart = block.timestamp;
        require(votingStart > 0, "Voting has not started yet");
        require(_durationInMinutes > 0, "Voting duration must be greater than zero");

        votingEnd = votingStart + (_durationInMinutes * 1 minutes);
    }

    function resetVotingEnd() internal {
        votingEnd = 0;
    }

    function endVoting() public onlyAdmin resultNotDeclared {
        require(votingStart > 0, "Voting has not started yet");
        require(block.timestamp < votingEnd, "Voting has already ended");

        // Call the internal function to reset votingEnd
        resetVotingEnd();
    }

    function declareResult() public onlyAdmin resultNotDeclared {
        // End the voting
        endVoting();

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

        // Emit an event to log the winner's name
        emit WinnerDeclared(winningCandidateName);

        // Set the result declared flag to true
        resultDeclared = true;
    }

    // Event to log the winner's name
    event WinnerDeclared(string winnerName);

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

    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }

    function getCandidateWithVotes(uint256 _index) public view returns (string memory, uint256, string memory, string memory, uint256) {
        require(_index < candidates.length, "Invalid candidate index");

        Candidate storage candidate = candidates[_index];
        return (candidate.name, candidate.age, candidate.party, candidate.candidateAddress, candidate.voteCount);
    }

    function isVotingOpen() public view returns (bool) {
        return block.timestamp >= votingStart && block.timestamp < votingEnd;
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
