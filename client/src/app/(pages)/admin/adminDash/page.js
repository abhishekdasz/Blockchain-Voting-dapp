"use client";
// Import necessary libraries and components
import AdminNavbar from "@/app/components/AdminNavbar";
import React from "react";
import './dashboard.css'

const AdminDashboardPage = () => {
  return (
    <div className="adminDash">
      {/* Admin Navbar */}
      <div className="navbar">
        <AdminNavbar />
      </div>

      {/* Admin Dashboard Content */}
      <div className="right-side">
        <div className="admin-dashboard-contents">
          <h1>Admin Dashboard</h1>

          {/* User Manual */}
          <div className="user-manual">
            <h3>User Manual:</h3>

            <h4>1. Add New Candidate:</h4>
            <p>
              - As an admin, you can add candidates to the election. Fill in the candidate's details, including name, age, party, and Ethereum address. Click the "Add Candidate" button to include them in the election.
            </p>
            <br />


            <h4>2. Candidates Information:</h4>
            <p>
              - View detailed information about all candidates including their name, age, party, address, and vote count.
            </p>
            <br />


            <h4>3. Voting Control:</h4>
            <p>
              - To start or end the voting process, click on the "Start Voting" or "End Voting" button respectively.
            </p>
            <p>
              - Set the duration for voting in minutes before starting the voting process.
            </p>
            <p>
              - After the voting period ends, click on the "Declare Result" button to announce the winner.
            </p>
            <p>
              - Once the result is declared, the winner's name and details will be displayed in this section.
            </p>
            <br />

            
            <h4>4. Admin Navbar:</h4>
            <p>
              - Use the navigation bar to access different sections of the admin dashboard easily.
            </p>
            <p>
              - Important notifications and updates will be displayed here for quick reference.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

