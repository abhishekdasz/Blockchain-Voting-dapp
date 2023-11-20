import React from 'react'

const LoginVoter = ({connectWallet}) => {

  return (
    <div>
        <button onClick={connectWallet}> Voter Login </button>
    </div>
  )
}

export default LoginVoter
