'use client'
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../../../contract/Voting.json";
import CON_ADDRESS, { candidateImages } from "../../../constants";
import AdminNavbar from "@/app/components/AdminNavbar";
import Image from "next/image";


const AllCandidatesInfo = () => {
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

  useEffect(() => {
    // Fetch and display candidates when the component mounts
    getAllCandidates();
    // Fetch and display voting status when the component mounts
  }, []); // Run this effect only once when the component mounts

  return (
    <div className="allCandidatesInfo-section">
        <div className="navbar">
            <AdminNavbar/>
        </div>

        <div className="right-side">
        <div className="allCandidatesInfo">
          <h2>All Candidates</h2>
          <div className="candidates">
            {candidates.map((candidate, index) => (
              <div className="candidates-info" key={index}>
                <div className="info">
                  <p> Name: {candidate.name} </p>
                  <p> Age: {candidate.age} </p>
                  <p> Party:{" "} {candidate.party} </p>
                  <p> Address: {`${candidate.candidateAddress.slice(0, 5)}....${candidate.candidateAddress.slice(-5)}`} </p>
                  {/* <p> Votes: {" "} {candidate.voteCount} </p>             */}
                </div>
                <div className="candidate-img">
                  <Image src={candidateImages[index % candidateImages.length]} alt="Candidate Image" width={100} height={100} />
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
    </div>
  );
};

export default AllCandidatesInfo;
