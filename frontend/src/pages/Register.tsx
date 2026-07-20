import React, { useState, type ChangeEvent, type FormEvent } from 'react';

type UserRole = 'Candidate' | 'Recruiter' | 'HiringManager';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Candidate'
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Register Request:", formData);
    // Backend Register API (axios.post('/api/auth/register', formData))
  };

  return (
    <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-4 font-sans">
      <div className="bg-[#1C2541] p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-[#2A365B]">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white tracking-wide">Create an Account</h1>
          <p className="text-gray-400 text-sm mt-1">Join TalentFlow AI platform today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Sashik Mindaka"
              className="w-full px-4 py-2.5 rounded-lg bg-[#0B132B] text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="sashik@example.com"
              className="w-full px-4 py-2.5 rounded-lg bg-[#0B132B] text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">I am registering as a:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0B132B] text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none cursor-pointer"
            >
              <option value="Candidate">Candidate (Job Seeker)</option>
              <option value="Recruiter">Recruiter / HR</option>
              <option value="HiringManager">Hiring Manager</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-[#0B132B] text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-[#0B132B] text-white border border-[#2A365B] focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-[#00C896] to-[#00E5FF] text-black font-bold rounded-lg hover:opacity-90 transition shadow-lg shadow-[#00E5FF]/20"
          >
            Register
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-5">
          Already have an account? <a href="/login" className="text-[#00E5FF] hover:underline font-medium">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;