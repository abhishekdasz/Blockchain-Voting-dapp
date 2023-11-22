// VoterReg.jsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../contract/Voting.json";
import { useRouter } from "next/navigation";
import CON_ADDRESS from "../constants";

const VoterReg = () => {
  const router = useRouter();
  const [voterName, setVoterName] = useState("");
  const [voterAge, setVoterAge] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const contractAddress = CON_ADDRESS;
  const contractAbi = abi.abi;

  useEffect(() => {
    // Check if the logged-in Metamask account is a registered voter
    const checkRegistrationStatus = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        const registered = await contractInstance.isRegisteredVoter();
        setIsRegistered(registered);

        // Redirect to voting page if the account is registered
        if (registered) {
          router.push("/voting");
        }
      } catch (error) {
        console.error("Error checking registration status:", error.message);
      }
    };

    checkRegistrationStatus();
  }, [router]);

  const registerVoter = async () => {
    try {
      if (!voterName || !voterAge) {
        console.error("Please fill in all the fields");
        return;
      }

      // Connect to the Ethereum provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
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
        // (you can choose to redirect to the voting page here if needed)
        setIsRegistered(true);
        router.push('/voting');  // Uncomment this line if you want to redirect after registration
      } else {
        console.error("Transaction failed. Check contract events for more details.");
      }
    } catch (error) {
      console.error("Error registering voter:", error.message);
    }
  };

  return (
    <div>
      {isRegistered ? (
        <p>You are already a registered voter. Redirecting to the voting page...</p>
      ) : (
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
        </div>
      )}
    </div>
  );
};

export default VoterReg;
