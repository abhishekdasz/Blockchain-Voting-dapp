"use client";
import AdminNavbar from "@/app/components/AdminNavbar";
import React from "react";

const page = () => {
  return (
    <div className="adminDash">
      <div className="navbar">
        <AdminNavbar />
      </div>
      <div className="right-side">
        <div className="contents">Admin Dashboard</div>
      </div>
    </div>
  );
};

export default page;
