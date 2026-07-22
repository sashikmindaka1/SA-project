import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import CandidateProfilePage from './pages/CandidateProfilePage';
import HiringManagerDashboard from './pages/HiringManagerDashboard';
import ApplicationTrackingFlow from './pages/ApplicationTrackingFlow';

import CandidateJobSearchPage from "./pages/CandidateJobSearchPage";
import RecruiterJobPostingPage from "./pages/RecruiterJobPostingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route: Redirects straight to Login Page */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Member 01 Routes (Auth & User Control) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Member 02's Route */}
        <Route path="/candidate/profile" element={<CandidateProfilePage />} />
        
        {/* Member 06's Route (Your Route!) */}
        <Route path="/manager/dashboard" element={<HiringManagerDashboard />} />

        {/* Team Routes */}
        <Route path="/applications" element={<ApplicationTrackingFlow />} />
        <Route path="/candidates" element={<ApplicationTrackingFlow />} />
        
        <Route path="/candidatejobs" element={<CandidateJobSearchPage />} />
        <Route path="/recruiter" element={<RecruiterJobPostingPage />} />

        {/* Fallback Route MUST be at the very bottom! */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;