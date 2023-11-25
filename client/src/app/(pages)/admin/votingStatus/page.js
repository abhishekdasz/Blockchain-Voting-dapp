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
  const [winnerDetails, setWinnerDetails] = useState([]);

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
      const result = await contract.declareResult();
      console.log("Result declared successfully", result);

      // Update the component state with the fetched winner and candidates
      setWinner(result[0]);
      setCandidates(result[1]);
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
        voteCount: candidate.voteCount.toNumber(),
      }));

      // Update the component state with the fetched candidates
      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
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

  // Listen for WinnerDeclared event
  // Listen for WinnerDeclared event
  useEffect(() => {
    const fetchWinner = async () => {
      try {
        // Connect to the Ethereum provider
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider
        );

        // Listen for WinnerDeclared event
        contract.on("WinnerDeclared", (winnerName, candidates) => {
          console.log("Winner Declared:", winnerName);
          setWinner(winnerName);
          setWinnerDetails(candidates);
          // You can also update the candidates state if needed
        });

        // Cleanup the event listener when the component unmounts
        return () => {
          contract.removeAllListeners("WinnerDeclared");
        };
      } catch (error) {
        console.error("Error listening for WinnerDeclared event:", error);
      }
    };

    fetchWinner();
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
                <p>
                  {" "}
                  Voting has not started yet. <br /> Please start the Voting !!!{" "}
                </p>
                <label>Voting Duration (minutes): </label>
                <input
                  type="number"
                  value={votingDuration}
                  onChange={(e) => setVotingDuration(e.target.value)}
                />
                <button onClick={startOrEndVoting}>Start Voting</button>
                <button onClick={declareResult}>Declare Result</button>
              </div>
            )}
            {isVotingStarted && (
              <button onClick={declareResult}>Declare Result</button>
            )}
          </div>
          <br /> <h1>Results:</h1>
          {winner && (
            <div className="winner-section">
              <h3>Congratulations, Winner is: {winner}</h3>

              <br />
              <div>
                <h2> Vote Stats: </h2>
                {winnerDetails.map((details, index) => (
                  <div key={index}>
                    <p>Name: {details[0]}</p>
                    <p>Age: {details[1].toString()}</p>
                    {/* <p>Address: {details[2]}</p> */}
                    <p>Party: {details[3]}</p>
                    <p>Votes: {details[4].toString()}</p>
                    <br />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
