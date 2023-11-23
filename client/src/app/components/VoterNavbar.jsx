import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./AdminNavbar.css";

const VoterNavbar = () => {
  const [active, setActive] = useState();
  const router = useRouter();
  const handleLogout = () => {
    router.push("/");
  };
  return (
    <div className="adminNavbar-section">
      <div className="adminNavbar-container">
        <Link href="/voter/voterDashboard" className={active}> Dashboard </Link>
        <Link href="/voter/registerVoter"> Registration </Link>
        <Link href="/voter/voting"> Voting </Link>
        <Link href="/voter/result"> Voting Result </Link>
        <div className="logout" onClick={handleLogout}> Logout </div>
      </div>
    </div>
  );
};

export default VoterNavbar;
