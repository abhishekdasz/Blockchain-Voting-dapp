import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";


const AdminDashboard = () => {
    const router = useRouter();

  const handleAllCandidates = () => {
    router.push('/admin/AllCandidatesInfo')
    setCurrentComponent(<AllCandidatesInfo />);
  };

  return (
    <div className="admin-dashboard-section">
      <div className="admin-dashboard-container">
        Admin Dashboard
        <Link href='/admin/addNewCandidate'> Add New Candidate </Link>
        <Link href='/admin/AllCandidatesInfo'> All Candidates Info </Link>
        <Link href='/admin/votingStatus'> Voting Status </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
