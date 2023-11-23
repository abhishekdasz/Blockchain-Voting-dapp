"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../../../contract/Voting.json";
import CON_ADDRESS from "../../../constants";
import AdminNavbar from "@/app/components/AdminNavbar";

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

  const addNewCandidate = async () => {
    try {
      if (!name || !age || !candidateAddress) {
        alert('Please fill in all the fields');
        console.error("Please fill in all the fields");
        return;
      }

      // Connect to the Ethereum provider
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      // Call the addCandidate function on the smart contract
      const transaction = await contract.addCandidate(
        name,
        parseInt(age),
        party,
        candidateAddress
      );

      // Wait for the transaction to be mined
      await transaction.wait();

      console.log("Candidate added successfully");
      alert('Candidate added successfully');
      setName("");
      setAge("");
      setParty("");
      setCandidateAddress("");

    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  return (
    <div className="addNewCandidate-section">
      <div className="navbar">
        <AdminNavbar />
      </div>

      <div className="right-side">
        <div className="AddCandidate-container">
          <div className="heading">
            <h1> Add Candidate Information </h1>
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div>
            <label>Party:</label>
            <input
              type="text"
              value={party}
              onChange={(e) => setParty(e.target.value)}
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              value={candidateAddress}
              onChange={(e) => setCandidateAddress(e.target.value)}
            />
          </div>
          <button onClick={addNewCandidate}>Add Candidate</button>
        </div>
      </div>
    </div>
  );
};

export default page;
