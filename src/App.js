import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const token = useSelector(state => state.user.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={token ? <Home /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
