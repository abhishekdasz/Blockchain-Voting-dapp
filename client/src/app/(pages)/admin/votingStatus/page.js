'use client'
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../../../contract/Voting.json";
import CON_ADDRESS from "../../../constants";

const page = () => {
  if (!window.ethereum) {
    console.error(
      "Ethereum provider not detected. Please make sure MetaMask or another Ethereum provider is installed."
    );
    return <div>Ethereum provider not available</div>;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [party, setParty] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [votingDuration, setVotingDuration] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [votingStatus, setVotingStatus] = useState(false);
  const [isVotingStarted, setIsVotingStarted] = useState(false);

  const contractAddress = CON_ADDRESS;
  const contractAbi = abi.abi;

  
  const startOrEndVoting = async () => {
    try {
      // Connect to the Ethereum provider
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      if (votingStatus) {
        // If voting is open, call endVoting
        const transaction = await contract.endVoting();
        await transaction.wait();
        console.log("Voting ended successfully");
      } else {
        // If voting is not open, call startVoting with the provided duration
        const transaction = await contract.startVoting(
          parseInt(votingDuration)
        );
        await transaction.wait();
        console.log("Voting started successfully");
      }

      // Update the voting status after calling startVoting or endVoting
      updateVotingStatus();
    } catch (error) {
      console.error("Error updating voting status:", error);
    }
  };

  const declareResult = async () => {
    try {
      // Connect to the Ethereum provider
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      // Call the declareResult function on the smart contract
      const transaction = await contract.declareResult();
      await transaction.wait();

      console.log("Result declared successfully");

      // After declaring the result, fetch and display all candidates with votes
      getAllCandidatesWithVotes();

      // Update the voting status after calling declareResult
      updateVotingStatus();
    } catch (error) {
      console.error("Error declaring result:", error);
    }
  };

  const getAllCandidates = async () => {
    try {
      // Connect to the Ethereum provider
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );

      // Call the getAllCandidates function on the smart contract
      const candidates = await contract.getAllCandidates();

      // Convert BigNumber values to JavaScript numbers
      const formattedCandidates = candidates.map((candidate) => ({
        name: candidate.name,
        age: candidate.age.toNumber(),
        party: candidate.party,
        candidateAddress: candidate.candidateAddress,
      }));

      // Update the component state with the fetched candidates
      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const getAllCandidatesWithVotes = async () => {
    try {
      // Connect to the Ethereum provider
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );

      // Call the getCandidateWithVotes function on the smart contract for each candidate
      const candidatesWithVotes = await Promise.all(
        Array.from({ length: candidates.length }, (_, i) =>
          contract.getCandidateWithVotes(i)
        )
      );

      // Convert BigNumber values to JavaScript numbers
      const formattedCandidates = candidatesWithVotes.map((candidate) => ({
        name: candidate[0],
        age: candidate[1].toNumber(),
        party: candidate[2],
        candidateAddress: candidate[3],
        voteCount: candidate[4].toNumber(),
      }));

      // Update the component state with the fetched candidates
      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error fetching candidates with votes:", error);
    }
  };

  const updateVotingStatus = async () => {
    try {
      // Connect to the Ethereum provider
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );

      // Call the isVotingOpen function on the smart contract
      const status = await contract.isVotingOpen();

      // Update the component state with the voting status
      setVotingStatus(status);

      // Update the component state with whether voting has started
      setIsVotingStarted(status);
    } catch (error) {
      console.error("Error fetching voting status:", error);
    }
  };

  useEffect(() => {
    // Fetch and display candidates when the component mounts
    getAllCandidates();
    // Fetch and display voting status when the component mounts
    updateVotingStatus();
  }, []); // Run this effect only once when the component mounts

  useEffect(() => {
    // Update the voting status whenever it changes
    updateVotingStatus();
  }, [votingStatus]); // Run this effect whenever votingStatus changes

  return (
    <div className="admin-dashboard-section">
      <div className="voting-state">
        <div className="startEndVoting">
          {votingStatus ? (
            <div>
              <button onClick={startOrEndVoting}>End Voting</button>
            </div>
          ) : (
            <div>
              <p> Voting has not started yet. Please the the Voting !!! </p>
              <label>Voting Duration (minutes): </label>
              <input
                type="number"
                value={votingDuration}
                onChange={(e) => setVotingDuration(e.target.value)}
              />
              <button onClick={startOrEndVoting}>Start Voting</button>
            </div>
          )}
          {isVotingStarted && (
            <button onClick={declareResult}>Declare Result</button>
          )}
        </div>
      </div> 

      <div className="candidate-information">
        <div>
          <h2>All Candidates</h2>
          <ul>
            {candidates.map((candidate, index) => (
              <li key={index}>
                Name: {candidate.name}, Age: {candidate.age}, Party:{" "}
                {candidate.party}, Address: {candidate.candidateAddress}, Votes:{" "}
                {candidate.voteCount}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default page;
