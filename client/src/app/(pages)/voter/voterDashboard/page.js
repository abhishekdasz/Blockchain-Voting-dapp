'use client'
import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import abi from '../../../contract/Voting.json'
import LoginVoter from '@/app/components/LoginVoter'
import VoterReg from '@/app/components/VoterReg'
import { useRouter } from 'next/navigation';
import CON_ADDRESS from '@/app/constants';
import VoterNavbar from '@/app/components/VoterNavbar';

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

    const handleVoterLogout = () => {
      router.push('/')
    }

  return (
    <div className='voter-dashboard-section'>
        <div className="voter-navbar">
            <VoterNavbar/>
        </div>
        <div className="voter-dashboard-container">
          <div className="voter-dashboard">
            <h1> Voter Dashboard </h1> <br />
            <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe laborum totam hic ipsum ducimus. Ut velit similique rerum consequatur temporibus cupiditate, expedita numquam quisquam tempora iure, sint delectus assumenda excepturi repellendus commodi ea blanditiis vel qui dolorum nam nostrum corrupti reprehenderit tempore. Dolorum consequuntur vero eum praesentium dolore facilis, quidem aperiam cum excepturi. Non, nihil vitae voluptate porro soluta magni placeat dolorum blanditiis autem, aut fugiat, libero fugit facilis corporis id doloribus. Nesciunt amet voluptates sapiente eos exercitationem ullam officiis quae voluptatibus. Cumque facilis vitae doloribus. Dignissimos ex facere placeat quia vel! Dignissimos eius autem voluptatibus doloribus, nesciunt, quas totam fugiat quo ducimus mollitia, provident facere. Ex facilis dolorum molestiae! Perspiciatis iste quis repudiandae in voluptatem, debitis officia quod eligendi sapiente est necessitatibus rem veniam aut commodi quia? Quas magnam quidem distinctio, cum quis qui, magni totam rem ut voluptates saepe itaque? Quidem quis amet iure aspernatur asperiores sequi eius doloremque quasi repudiandae delectus. Fugit qui recusandae ipsa at. Praesentium soluta ad totam, deleniti exercitationem tenetur aliquam mollitia quasi earum, voluptates rem non id natus? Esse similique laboriosam impedit, nemo iste asperiores enim, unde accusantium vel libero commodi placeat ullam ratione dolores natus quibusdam, vitae perferendis voluptatum tempora voluptatibus repellendus ducimus? Recusandae eius consequatur porro quam libero vero non cumque deleniti nihil architecto temporibus, sequi quas, exercitationem similique beatae deserunt ea! Odio quo quisquam, deleniti minus sunt iusto vel fuga exercitationem adipisci corrupti, nihil hic totam recusandae magnam. Ipsam assumenda amet nobis corrupti possimus iste recusandae quisquam cum quidem voluptatibus. </p>
          </div>
        </div>

    </div>
  )
}

export default page
