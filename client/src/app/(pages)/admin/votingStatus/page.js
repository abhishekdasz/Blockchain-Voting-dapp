// Import necessary libraries and components
"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../../../contract/Voting.json";
import CON_ADDRESS, { candidateImages } from "../../../constants";
import AdminNavbar from "@/app/components/AdminNavbar";
import Image from "next/image";

const Page = () => {
  // Check for the Ethereum provider
  if (!window.ethereum) {
    console.error(
      "Ethereum provider not detected. Please make sure MetaMask or another Ethereum provider is installed."
    );
    return <div>Ethereum provider not available</div>;
  }

  // Ethereum provider setup
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // State variables
  const [votingDuration, setVotingDuration] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [votingStatus, setVotingStatus] = useState(true); // Assume voting is in progress
  const [isVotingStarted, setIsVotingStarted] = useState(true); // Assume voting is in progress
  const [winner, setWinner] = useState("");

  // Contract details
  const contractAddress = CON_ADDRESS;
  const contractAbi = abi.abi;

  // Start or end voting
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

  // Declare result
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

      // Fetch the winning candidate's name
      const winnerIndex = await contract.getWinnerIndex();
      const winner = await contract.getCandidateWithVotes(winnerIndex);

      // Update the component state with the fetched candidates and winner
      setCandidates(formattedCandidates);
      setWinner(winner[0]);
    } catch (error) {
      console.error("Error declaring result:", error);
    }
  };

  // Fetch all candidates
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

  // Fetch all candidates with votes
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

  // Update voting status
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

      // Fetch candidates with votes after updating the voting status
      getAllCandidatesWithVotes();
    } catch (error) {
      console.error("Error fetching voting status:", error);
    }
  };

  // Fetch and display candidates when the component mounts
  useEffect(() => {
    getAllCandidates();
  }, []);

  // Fetch and display voting status when the component mounts
  useEffect(() => {
    updateVotingStatus();
  }, []);

  // Render JSX
  return (
    <div className="votingState-sec">
      <div className="navbar">
        <AdminNavbar />
      </div>

      <div className="right-side">
        <div className="votingState">
          <div className="startEndVoting">
            {votingStatus ? (
              <div>
                <button onClick={startOrEndVoting}>End Voting</button>
              </div>
            ) : (
              <div>
                <p> Voting has not started yet. <br /> Please start the Voting !!! </p>
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

          <div className="candidates-information">
            <div>
              <h2>All Candidates</h2>
              <div className="candidates">
                {candidates.map((candidate, index) => (
                  <div className="candidates-info" key={index}>
                    <div className="info">
                      <p> Name: {candidate.name} </p>
                      <p> Age: {candidate.age} </p>
                      <p> Party: {candidate.party} </p>
                      <p>
                        {" "}
                        Address:{" "}
                        {`${candidate.candidateAddress.slice(
                          0,
                          5
                        )}....${candidate.candidateAddress.slice(-5)}`}{" "}
                      </p>
                      <p> Votes: {candidate.voteCount} </p>
                    </div>
                    <div className="candidate-img">
                      <Image
                        src={candidateImages[index % candidateImages.length]}
                        alt="Candidate Image"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Display the winner */}
          {winner && (
            <div className="winner-section">
              <h2>Winner</h2>
              <p>{winner}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
