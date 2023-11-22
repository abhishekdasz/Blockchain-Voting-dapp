import React, { useState } from "react";
import "./AdminDashboard.css";
import AllCandidatesInfo from "./AllCandidatesInfo";

const AdminDashboard = () => {
  const [currentComponent, setCurrentComponent] = useState(null);

  const handleAllCandidates = () => {
    setCurrentComponent(<AllCandidatesInfo />);
  };

  return (
    <div className="admin-dashboard-section">
      <div className="admin-dashboard-container">
        Admin Dashboard
        <button onClick={handleAllCandidates}> All Candidates </button>

        {/* Render the current component */}
        {currentComponent}
      </div>
    </div>
  );
};

export default AdminDashboard;
