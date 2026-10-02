import './App.css'
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoutes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp  from './pages/signUp';
import LoginPage from './pages/loginPage';
import HomePage from './pages/Homepage';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
