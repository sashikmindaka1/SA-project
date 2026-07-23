import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// Defines the TypeScript interface for form state
interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();

  // Local state for form inputs, request loading, and alert messages
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Updates form input values dynamically on user typing
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles form submission and calls the backend Authentication API
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Send login credentials to the .NET Web API
      const response = await fetch('http://localhost:5016/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle backend API error response
      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password!');
      }

      // Store JWT token and user profile in browser local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccessMsg('Login successful! Redirecting...');
      
      // Redirect user based on role (or directly to Hiring Manager Dashboard)
      // Redirect user to the dashboard
    setTimeout(() => {

  const rawRole = data.user?.role || data.user?.Role || '';
  const userRole = rawRole.toUpperCase();



  if (userRole === 'HIRING_MANAGER' || userRole === 'RECRUITER' || userRole === 'MANAGER') {

    localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
  } else if (userRole === 'CANDIDATE') {

    navigate('/candidate/profile');
  } else {
    // 
    navigate('/candidate/profile');
  }
}, 1000);
    } catch (err: any) {
      // Catch network or validation errors
      setErrorMsg(err.message || 'Something went wrong. Please try again!');
    } finally {
      // Reset loading state after request completion
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B132B] flex items-center justify-center p-4 font-sans">
      {/* Main Login Card Container */}
      <div className="bg-[#1C2541] p-6 rounded-xl shadow-2xl w-full max-w-sm border border-[#2A365B]">
        
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            TalentFlow <span className="text-[#00E5FF]">AI</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Welcome back! Please enter your details.</p>
        </div>

        {/* Dynamic Error Alert Display */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Dynamic Success Alert Display */}
        {successMsg && (
          <div className="mb-4 p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center">
            {successMsg}
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. user@nsbm.ac.lk"
              className="w-full px-3 py-2 rounded-md bg-[#0B132B] text-xs text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-md bg-[#0B132B] text-xs text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none transition-colors"
            />
          </div>

          {/* Form Options: Remember Me & Password Recovery Link */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center text-gray-400 cursor-pointer select-none">
              <input type="checkbox" className="mr-1.5 rounded bg-[#0B132B] border-[#2A365B] text-[#00E5FF] focus:ring-0" />
              Remember me
            </label>
            <a href="/forgot-password" className="text-[#00E5FF] hover:underline">Forgot password?</a>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#00C896] to-[#00E5FF] text-black font-semibold text-xs rounded-md hover:opacity-90 transition-opacity shadow-md shadow-[#00E5FF]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Navigation Link */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Don't have an account? <a href="/register" className="text-[#00E5FF] hover:underline font-medium">Sign up</a>
        </p>

      </div>
    </div>
  );
};

export default Login;