import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B132B] flex items-center justify-center p-4 font-sans">
      {/* Card Container */}
      <div className="bg-[#1C2541] p-6 rounded-xl shadow-2xl w-full max-w-sm border border-[#2A365B]">
        
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-xl font-bold text-white tracking-tight">Reset Your Password</h1>
          <p className="text-xs text-gray-400 mt-1">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#00C896]/10 border border-[#00C896] text-[#00C896] p-3 rounded-md text-center text-xs">
            If an account exists with <b>{email}</b>, a reset link has been sent. Check your inbox!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="user@nsbm.ac.lk"
                className="w-full px-3 py-2 rounded-md bg-[#0B132B] text-xs text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-[#00C896] to-[#00E5FF] text-black font-semibold text-xs rounded-md hover:opacity-90 transition shadow-md shadow-[#00E5FF]/10"
            >
              Send Reset Link
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center mt-5">
          <a href="/login" className="text-xs text-gray-400 hover:text-white transition">← Back to Login</a>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;