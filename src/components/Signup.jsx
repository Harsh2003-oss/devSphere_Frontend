import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    skills: '',
    about: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        }),
      });

      const data = await response.text();

      if (response.ok) {
        alert('Welcome User!');
        navigate('/feed');
      } else {
        setError(data || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 px-6 py-4 text-center">
        <img className="w-16 h-16 rounded-4xl mx-auto mb-3" src="dev_logo.jpeg" alt="Logo" />
        <h1 className="text-3xl font-bold text-white">devSphere</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Create Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              placeholder="First name"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              placeholder="Last name"
            />
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            placeholder="Email"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="18"
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              placeholder="Age"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:border-pink-500"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            placeholder="Skills (comma separated)"
          />

          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 resize-none"
            placeholder="About yourself"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-3 rounded hover:from-pink-600 hover:to-orange-600 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-zinc-800">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-500 font-semibold hover:text-pink-400">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;