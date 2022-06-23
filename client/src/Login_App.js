import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './login/Login';
import Navbar from './Navbar/Navbar';
import Signed from './Signed/Signed';
import { Sign } from '@tensorflow/tfjs';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Login_App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  return (
  <BrowserRouter>
    <Container style={{backgroundColor:'#F8F5F2'}} maxWidth="lg">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/signed" element={
            <ProtectedRoute user={user}>
              <Signed />
            </ProtectedRoute>
            }
        />
            {/* element={<Signed/>} /> */}
        <Route exact path="/App" element={
          <ProtectedRoute user={user}>
            <App />
          </ProtectedRoute>
        
        } />
      </Routes>
    </Container>
  </BrowserRouter>
  )
};



export default Login_App;