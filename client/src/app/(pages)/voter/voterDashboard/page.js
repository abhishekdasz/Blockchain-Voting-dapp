"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../../../contract/Voting.json";
import { useRouter } from "next/navigation";
import CON_ADDRESS from "@/app/constants";
import VoterNavbar from "@/app/components/VoterNavbar";

const page = () => {
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(false);

  const contractAddress = CON_ADDRESS;
  const contractAbi = abi.abi;

  // Connect to Metamask
  const connectContract = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask connected" + address);
        setIsConnected(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getCurrentStatus();
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
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

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
    console.log(status);
    setVotingStatus(status);
  };

  const handleVoterLogout = () => {
    router.push("/");
  };

  return (
    <div className="voter-dashboard-section">
      <div className="voter-navbar">
        <VoterNavbar />
      </div>
      <div className="voter-dashboard-container">
        <div className="voter-dashboard">
          <h1> Voter Dashboard </h1> <br />
          <h3>User Manual:</h3>
          <h4>1. Registration Phase:</h4>
          <p>
            - During the registration phase, voters can register for the
            upcoming election. Fill in the required details and click the
            "Register" button.
          </p>
          <br />
          <h4>2. Cast Your Vote:</h4>
          <p>
            - As a registered voter, you can cast your vote for your preferred
            candidate. Click the "Vote Now" button, select your candidate, and
            submit your vote.
          </p>
          <br />
          <h4>3. Election Information:</h4>
          <p>
            - View information about the ongoing election, including the list of
            candidates and their details.
          </p>
          <br />
          <h4>4. Voting Status:</h4>
          <p>
            - Check the status of the voting process, whether it is open or
            closed.
          </p>
          <br />
          <h4>5. Important Notices:</h4>
          <p>
            - Any important notifications or updates related to the election
            will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
