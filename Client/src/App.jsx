import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import isAuthenticated from './Auth/Auth'
import SignUp from './Auth/SignUp'
import SignIn from './Auth/SignIn'


const App = () => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  
    const checkAuth = () => {
      const authToken = isAuthenticated();
      setToken(authToken);
      setIsLoading(false);
    };

    checkAuth();

  
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        const authToken = isAuthenticated();
        setToken(authToken);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

 
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={token ? <Home /> : <SignUp />} />
        <Route path='/sign' element={token ? <Home /> : <SignUp />}/>
        <Route path='/login' element={token ? <Home /> : <SignIn />}/>
      </Routes>
    </Router>
  )
}

export default App