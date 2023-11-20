'use client'
import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import abi from '../../contract/Voting.json';
import AdminLogin from '@/app/components/AdminLogin';
import AddCandidate from '@/app/components/AddCandidate';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [votingStatus, setVotingStatus] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const contractAddress = '0xc21cfd0c6c1Be129851Df046944BbedA575D731A';
    const contractAbi = abi.abi;

    // Connect to Metamask and check if the account is an admin
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

                // Check if the connected account is an admin
                const contractInstance = new ethers.Contract (
                    contractAddress, contractAbi, signer
                );
                const adminStatus = await contractInstance.isAdmin();
                setIsAdmin(adminStatus);

                if (!adminStatus) {
                    alert("You are not logged in as an admin. Please log in with your admin account");
                }

            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        getCurrentStatus();
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
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
            setIsAdmin(false); // Reset isAdmin state when disconnected
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

    const handleAdminLogout = () => {
      router.push('/')
    }

    return (
        <div>
            Admin
            <div className="login-admin">
            {isConnected && isAdmin ? ( // Only render AddCandidate if isConnected and isAdmin
                <AddCandidate account={account} provider={provider} />
            ) : (
                <AdminLogin connectWallet={connectContract} />
            )}
            </div>
            <div className="logout">
              <button onClick={handleAdminLogout}> Logout </button>
            </div>
        </div>
    );
};

export default Page;
