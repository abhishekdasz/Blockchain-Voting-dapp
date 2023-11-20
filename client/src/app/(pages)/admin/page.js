'use client'
import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import abi from '../../contract/Voting.json'
import AdminLogin from '@/app/components/AdminLogin';
import AddCandidate from '@/app/components/AddCandidate';


const page = () => {

    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [votingStatus, setVotingStatus] = useState(false);

    const contractAddress = '0x1C55493385aE66B103E5A7dfDFF24b4C52F63E13';
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

      useEffect( () => {
        getCurrentStatus();
        if (window.ethereum) {
          window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
    
        return() => {
          if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          }
        }
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
        const contractInstance = new ethers.Contract (
          contractAddress, contractAbi, signer
        );
        const status = await contractInstance.getVotingStatus();
        console.log(status);
        setVotingStatus(status);
      }
   
  return (
    <div>
      Admin
      <div className="login-admin">
      {isConnected ? (
        <AddCandidate account={account} provider={provider} />
      ) : (
        <AdminLogin connectWallet={connectContract} />
      )}
      </div>
    </div>
  )
}

export default page
