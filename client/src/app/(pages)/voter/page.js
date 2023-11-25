"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../../contract/Voting.json";
import { useRouter } from "next/navigation";
import CON_ADDRESS from "@/app/constants";

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

        if (!isConnected) {
          alert(
            "You are not logged in to the Metamask. Please log in with your Metamask"
          );
        } else {
          router.push("/voter/voterDashboard");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    connectContract();
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

  return <div>Voter</div>;
};

export default page;
