import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './login/Login';
import Navbar from './Navbar/Navbar';
import Signed from './Signed/Signed';
//import ProtectedRoute from './ProtectedRoute';
// const ProtectedRoute = ({ user, children }) => {
//   console.log(user);
//   if (!user) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Login_App = () => {
  //const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  return (
  <BrowserRouter>
    <Container style={{backgroundColor:'#F8F5F2', width:'100%'}} maxWidth= "none">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/signed" element={
            // <ProtectedRoute user={user}>
            <ProtectedRoute>
              <Signed />
            </ProtectedRoute>
            }
        />
            {/* element={<Signed/>} /> */}
        <Route exact path="/App" element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        
        } />
      </Routes>
    </Container>
  </BrowserRouter>
  )
};



export default Login_App;