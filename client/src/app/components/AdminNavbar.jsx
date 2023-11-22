import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const [active, setActive] = useState();
  const router = useRouter();
  const handleLogout = () => {
    router.push("/");
  };
  return (
    <div className="adminNavbar-section">
      <div className="adminNavbar-container">
        <Link href="/admin/adminDash" className={active}> Admin Dashboard </Link>
        <Link href="/admin/addNewCandidate"> Add New Candidate </Link>
        <Link href="/admin/AllCandidatesInfo"> All Candidates Info </Link>
        <Link href="/admin/votingStatus"> Voting Status </Link>
        <div className="logout" onClick={handleLogout}> Logout </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
