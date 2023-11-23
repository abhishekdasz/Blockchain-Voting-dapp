'use client'
import React, { useState } from 'react'
import VoterNavbar from '@/app/components/VoterNavbar'
import { ethers } from "ethers";
import abi from '../../../contract/Voting.json'
import CON_ADDRESS from '@/app/constants';

const page = () => {
    const [voterName, setVoterName] = useState("");
    const [voterAge, setVoterAge] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
  
    const contractAddress = CON_ADDRESS;
    const contractAbi = abi.abi;
    const registerVoter = async () => {
        try {
          if (!voterName || !voterAge) {
            console.error("Please fill in all the fields");
            alert("Please fill in all the fields")
            return;
          }
          checkRegistrationStatus();
          if(isRegistered)
          {
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
          } else {
            console.error("Transaction failed. Check contract events for more details.");
          }
        } catch (error) {
          console.error("Error registering voter:", error.message);
        }
      };


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
  
          // Redirect to voting page if the account is registered
          if (registered) {
            setIsRegistered(true);
            alert("Already registerred");
            return;
          }
        } catch (error) {
          console.error("Error checking registration status:", error.message);
        }
      };
  return (
    <div className='registerVoter-section'>
        <div className="voter-navbar">
            <VoterNavbar/>
        </div>
        <div className="registerVoter-container">
        <div className='registerVoter-card'>
          <h2>Register Voter</h2>
          <div className="registerVoter-inputs">
          <div>
            <label>Name:</label>
            <input type="text" value={voterName} onChange={(e) => setVoterName(e.target.value)} />
          </div>
          <div>
            <label>Age:</label>
            <input type="number" value={voterAge} onChange={(e) => setVoterAge(e.target.value)} />
          </div>
          <div>
            <label> Aadhar Number </label>
            <input type="number"/>
          </div>
          </div>

          <button onClick={registerVoter}>Register Voter</button>
        </div>
        </div>
    </div>
  )
}

export default page
