import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Remove token or any user data from localStorage/sessionStorage
    localStorage.removeItem('token')
    // Optionally clear all storage: localStorage.clear()
    navigate('/login') // Redirect to login page
  }, [navigate])

  return (
    <div>Logging out...</div>
  )
}

export default Logout