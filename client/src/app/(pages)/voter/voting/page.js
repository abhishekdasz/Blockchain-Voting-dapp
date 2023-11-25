"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../../../contract/Voting.json";
import { useRouter } from "next/navigation";
import CON_ADDRESS, { candidateImages } from "@/app/constants";
import VoterNavbar from "@/app/components/VoterNavbar";
import Image from "next/image";

const Page = () => {
  if (!window.ethereum) {
    console.error(
      "Ethereum provider not detected. Please make sure MetaMask or another Ethereum provider is installed."
    );
    return <div>Ethereum provider not available</div>;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  const contractAddress = CON_ADDRESS;
  const contractAbi = abi.abi;

  const voteForCandidate = async (index) => {
    try {
      if (index === null || index === undefined) {
        console.error("Invalid candidate index");
        return;
      }

      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      const transaction = await contract.vote(index);

      await transaction.wait();

      console.log("Vote submitted successfully");
      alert("Your vote has been recorded successfully");
      setHasVoted(true);
    } catch (error) {
      console.error("Error submitting vote:", error);
      if (
        error.message.includes("Only registered voters can call this function")
      ) {
        alert("Only registered voters can vote, so kindly register first.");
      } else if (error.message.includes("Voting is not currently open")) {
        alert(
          "Voting is not currently open, please wait until the Voting has started."
        );
      } else {
        alert("An error occurred while submitting your vote");
      }
    }
  };

  const getCandidates = async () => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );

      const candidates = await contract.getAllCandidates();

      const formattedCandidates = candidates.map((candidate) => ({
        name: candidate.name,
        age: candidate.age.toNumber(),
        candidateAddress: candidate.candidateAddress,
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
    <div className="voting-section">
      <div className="voter-navbar">
        <VoterNavbar />
      </div>

      <div className="voting-container">
        <div className="voting-card">
          <h2>Vote for a Candidate</h2> <br />
          {hasVoted ? (
            <p>You have already voted. Thank you for participating!</p>
          ) : (
            <div>
              <div className="candidates">
                {candidates.map((candidate, index) => (
                  <div className="candidates-info" key={index}>
                    <div className="info">
                      <p> Name: {candidate.name} </p>
                      <p> Age: {candidate.age} </p>
                      <p> Party: {candidate.party} </p>
                      <p>
                        {" "}
                        Address:
                        {`${candidate.candidateAddress.slice(
                          0,
                          5
                        )}....${candidate.candidateAddress.slice(-5)}`}{" "}
                      </p>
                      {/* <p> VoteCount: {candidate.voteCount} </p> */}
                      <button onClick={() => voteForCandidate(index)}>
                        Votee
                      </button>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
