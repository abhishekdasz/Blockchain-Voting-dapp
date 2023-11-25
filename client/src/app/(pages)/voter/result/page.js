// Import necessary libraries and components
"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../../../contract/Voting.json";
import VoterNavbar from "@/app/components/VoterNavbar";
import CON_ADDRESS from "@/app/constants";

const Page = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(false);
  const [winner, setWinner] = useState(null);
  const [candidates, setCandidates] = useState([]);

  const contractAddress = CON_ADDRESS;
  const contractAbi = abi.abi;

  // Connect to MetaMask
  const connectContract = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("MetaMask connected" + address);
        setIsConnected(true);
        getCurrentStatus();
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Handle MetaMask account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [account]);

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      getCurrentStatus();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  // Get the current voting status
  const getCurrentStatus = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const status = await contractInstance.getVotingStatus();
    console.log("Voting Status:", status);
    setVotingStatus(status);

    // If the voting has ended, fetch the winner details
    if (!status) {
      fetchWinnerDetails();
    }
  };

  // Fetch winner details
  const fetchWinnerDetails = async () => {
    try {
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      const result = await contractInstance.getWinner();
      console.log("Winner Details:", result);
      setWinner(result.winnerName);
      setCandidates(result.candidates);
    } catch (error) {
      console.error("Error fetching winner details:", error);
    }
  };

  const handleVoterLogout = () => {
    // Handle voter logout logic here
  };

  // Render JSX
  return (
    <div className="result-section">
      <div className="voter-navbar">
        <VoterNavbar />
      </div>
      <div className="result-container">
        <div className="result-card">
          Result
          {votingStatus ? (
            <p>
              Voting is still in progress. Winner details will be available
              after voting ends.
            </p>
          ) : winner ? (
            <div>
              <h2>Winner</h2>
              <p>{winner}</p>
              <h3>All Candidates</h3>
              <ul>
                {candidates.map((candidate, index) => (
                  <li key={index}>
                    <p>Name: {candidate.name}</p>
                    <p>Party: {candidate.party}</p>
                    {/* Add other candidate details as needed */}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No winner declared yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
