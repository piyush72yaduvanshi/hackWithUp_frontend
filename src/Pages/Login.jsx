import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'https://hackwithupbackend-main-production.up.railway.app';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // IMPORTANT: Clear any existing user data BEFORE logging in
      // This ensures we don't show old user data when logging in with a different account
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      const response = await axios.post(`${BACKEND_URL}/auth/v1/login`, {
        email,
        password
      }, {
        withCredentials: true, // Important for cookie-based auth
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Detailed console logging for response data
      console.log('Full Response:', response.data);
      console.log('Success:', response.data.success);
      console.log('Message:', response.data.message);
      console.log('User Data:', response.data.user);
      console.log('User ID:', response.data.user.id);
      console.log('User Name:', response.data.user.name);
      console.log('User Email:', response.data.user.email);

      // Handle successful login
      if (response.data.success) {
        // Store NEW user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Store token if present
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        // Force page reload to clear any cached data and ensure fresh state
        window.location.href = '/profile';
      }
      
    } catch (err) {
      // Handle error
      console.error('Login Error:', err);
      console.error('Error Response:', err.response?.data);
      
      if (err.response) {
        setError(err.response.data.message || 'Login failed');
      } else if (err.request) {
        setError('No response from server. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-3xl font-bold text-white text-center">Welcome Back</h2>
            <p className="text-blue-100 text-center mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="mb-5">
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
