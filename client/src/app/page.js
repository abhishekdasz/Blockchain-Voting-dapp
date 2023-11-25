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
            <h1 style={{ color: "#fff" }}>
              Welcome to Our <br /> Secure & Transparent <br /> Voting Platform
            </h1>
            <h3 style={{ color: "#fff" }}>
              Make your voice heard in a digital democracy designed for trust
              and integrity.
            </h3>
            <p>
              At our voting platform, we prioritize the security and
              transparency of every vote. Our cutting-edge technology ensures
              that your vote is confidential, tamper-proof, and accurately
              counted. Join us in shaping the future by participating in a
              voting process that empowers individuals and strengthens the
              foundations of democracy.
            </p>

            <div className={styles.buttons}>
              <div className={styles.btn} onClick={handleAdminLogin}>
                {" "}
                Admin Login{" "}
              </div>
              <div className={styles.btn} onClick={handleVoterLogin}>
                {" "}
                Voter Login/Sign up{" "}
              </div>
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
