"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const page = () => {
  const router = useRouter();

  const handleVoterLogin = () => {
    router.push("/voter");
  };
  const handleAdminLogin = () => {
    router.push("/admin");
  };
  return (
    <div className={styles.homeSec}>
      <div className={styles.homeDiv}>
        <div className={styles.leftSec}>
          <div className={styles.header}>
            <h1> Welcome to Our <br /> Voting Platform </h1>
            <h3> Make your voice heard! </h3>
            <h3> We ensure a secure and transparent voting process </h3>

            <div className={styles.buttons}>
              <div className={styles.btn} onClick={handleVoterLogin}> Voter Login/Sign up </div>
              <div className={styles.btn} onClick={handleAdminLogin}> Admin Login </div>
            </div>
          </div>
        </div>

        <div className={styles.rightSec}>
          <img src="home.png" alt="home" />
        </div>
      </div>
    </div>
  );
};

export default page;
