'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter();

  const handleVoterLogin = () => {
    router.push('/voter')
  }
  const handleAdminLogin = () => {
    router.push('/admin')
  }
  return (
    <div>
      Hello World
      <div className="voter">
        <button onClick={handleVoterLogin}> Voter Login/Sign up </button>
      </div>
      <div className="admin">
        <button onClick={handleAdminLogin}> Admin Login </button>
      </div>
    </div>
  )
}

export default page
