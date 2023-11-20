import React from 'react'

const AdminLogin = ({connectWallet}) => {
  return (
    <div>
        <button onClick={connectWallet}> Admin Login </button>
    </div>
  )
}

export default AdminLogin
