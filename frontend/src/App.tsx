import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CandidateProfilePage from './pages/CandidateProfilePage';
import HiringManagerDashboard from './pages/HiringManagerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route: Redirects to the Candidate Profile so it's never blank */}
        <Route path="/" element={<Navigate to="/candidate/profile" replace />} />

        {/* Member 02's Route */}
        <Route path="/candidate/profile" element={<CandidateProfilePage />} />
        
        {/* Member 06's Route */}
        <Route path="/manager/dashboard" element={<HiringManagerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;