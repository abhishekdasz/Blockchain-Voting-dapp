import React from 'react'

const Login = ({connectWallet}) => {
  return (
    <div>
        <button onClick={connectWallet}> Admin Login </button>
    </div>
  )
}

export default Login
