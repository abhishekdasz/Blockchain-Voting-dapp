'use client'
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../../contract/Voting.json";
import { useRouter } from "next/navigation";
import CON_ADDRESS from "@/app/constants";

const page = () => {
  const router = useRouter();

  if (!window.ethereum) {
    console.error("Ethereum provider not detected. Please make sure MetaMask or another Ethereum provider is installed.");
    return <div>Ethereum provider not available</div>;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  const contractAddress = CON_ADDRESS;
  const contractAbi = abi.abi;

  const voteForCandidate = async () => {
    try {
      if (!selectedCandidate) {
        console.error("Please select a candidate");
        return;
      }

      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const transaction = await contract.vote(selectedCandidate);

      await transaction.wait();

      console.log("Vote submitted successfully");

      // Update local state
      setHasVoted(true);

      // You might want to redirect to a "Thank you for voting" page
      // router.push('/thank-you');
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const getCandidates = async () => {
    try {
      const contract = new ethers.Contract(contractAddress, contractAbi, provider);

      const candidates = await contract.getAllCandidates();

      const formattedCandidates = candidates.map(candidate => ({
        name: candidate.name,
        age: candidate.age.toNumber(),
        candidateAddress: candidate.candidateAddress
      }));

      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    // Fetch candidates when the component mounts
    getCandidates();
  }, []);

  return (
    <div>
      <h2>Vote for a Candidate</h2>
      {hasVoted ? (
        <p>You have already voted. Thank you for participating!</p>
      ) : (
        <div>
          <label>Select a Candidate:</label>
          <select onChange={(e) => setSelectedCandidate(e.target.value)}>
            <option value="">-- Select --</option>
            {candidates.map((candidate, index) => (
              <option key={index} value={index}>
                {candidate.name}
              </option>
            ))}
          </select>
          <button onClick={voteForCandidate}>Vote</button>
        </div>
      )}
    </div>
  );
};

export default page;
