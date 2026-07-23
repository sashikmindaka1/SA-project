import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import SettingsPage from "./pages/SettingsPage";

import CandidateProfilePage from "./pages/CandidateProfilePage";
import HiringManagerDashboard from "./pages/HiringManagerDashboard";
import ApplicationTrackingFlow from "./pages/ApplicationTrackingFlow";

import CandidateJobSearchPage from "./pages/CandidateJobSearchPage";
import RecruiterJobPostingPage from "./pages/RecruiterJobPostingPage";
import NewCandidatePage from "./pages/NewCandidatePage";
import TalentFlowDashboard from "./pages/TalentFlowDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard Landing Page */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={<TalentFlowDashboard />}
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Candidate */}
        <Route
          path="/candidate/profile"
          element={<CandidateProfilePage />}
        />

        <Route
          path="/candidatejobs"
          element={<CandidateJobSearchPage />}
        />

        {/* Recruiter */}
        <Route
          path="/recruiter"
          element={<RecruiterJobPostingPage />}
        />

        {/* Candidates */}
        <Route
          path="/newCandidates"
          element={<NewCandidatePage />}
        />

        {/* Manager */}
        <Route
          path="/manager/dashboard"
          element={<HiringManagerDashboard />}
        />

        {/* Applications */}
        <Route
          path="/applications"
          element={<ApplicationTrackingFlow />}
        />

        <Route
          path="/candidates"
          element={<ApplicationTrackingFlow />}
        />

        <Route path="/settings" element={<SettingsPage />} 
        />
        

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;