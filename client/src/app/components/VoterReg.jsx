import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../contract/Voting.json";

const VoterReg = () => {
  // Ensure that window.ethereum is available
  if (!window.ethereum) {
    console.error("Ethereum provider not detected. Please make sure MetaMask or another Ethereum provider is installed.");
    return <div>Ethereum provider not available</div>; // Or handle the lack of provider in your application
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [voterName, setVoterName] = useState("");
  const [voterAge, setVoterAge] = useState("");
  const [voters, setVoters] = useState([]);

  const contractAddress = '0x735335e988932CFbEF980dcD53C7a49c03c693Ae';
  const contractAbi = abi.abi;

  const registerVoter = async () => {
    try {
      if (!voterName || !voterAge) {
        console.error("Please fill in all the fields");
        return;
      }

      // Connect to the Ethereum provider
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      // Call the registerVoter function on the smart contract
      const gasLimit = 200000;
      const transaction = await contract.registerVoter(voterName, parseInt(voterAge), { gasLimit });
      

      // Wait for the transaction to be mined
      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        console.log("Voter registered successfully");
        // After registering a voter, fetch and display all voters
        getAllVoters();
      } else {
        console.error("Transaction failed. Check contract events for more details.");
      }
    } catch (error) {
      console.error("Error registering voter:", error.message);
    }
  };

  const getAllVoters = async () => {
    try {
      // Connect to the Ethereum provider
      const contract = new ethers.Contract(contractAddress, contractAbi, provider);

      // Call the getAllVoters function on the smart contract
      const voters = await contract.getAllVoters();

      // Convert BigNumber values to JavaScript numbers
      const formattedVoters = voters.map(voter => ({
        name: voter.name,
        age: voter.age.toNumber(),
      }));

      // Update the component state with the fetched voters
      setVoters(formattedVoters);
    } catch (error) {
      console.error("Error fetching voters:", error.message);
    }
  };

  useEffect(() => {
    // Fetch and display voters when the component mounts
    getAllVoters();
  }, []); // Run this effect only once when the component mounts

  return (
    <div>
      <h2>Register Voter</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={voterName} onChange={(e) => setVoterName(e.target.value)} />
      </div>
      <div>
        <label>Age:</label>
        <input type="number" value={voterAge} onChange={(e) => setVoterAge(e.target.value)} />
      </div>
      <button onClick={registerVoter}>Register Voter</button>

      <div>
        <h2>All Voters</h2>
        <ul>
          {voters.map((voter, index) => (
            <li key={index}>
              Name: {voter.name}, Age: {voter.age}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VoterReg;
