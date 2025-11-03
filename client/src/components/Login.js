import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password });
      const { token, user } = response.data;

      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      onLoginSuccess(user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Novu POC</h1>
          <p>Task Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="quick-login">
          <p className="quick-login-title">Quick Login:</p>
          <div className="quick-login-buttons">
            <button
              onClick={() => quickLogin('admin', 'admin123')}
              className="quick-button admin"
              disabled={loading}
            >
              Admin
            </button>
            <button
              onClick={() => quickLogin('user1', 'user123')}
              className="quick-button user"
              disabled={loading}
            >
              User 1
            </button>
            <button
              onClick={() => quickLogin('user2', 'user123')}
              className="quick-button user"
              disabled={loading}
            >
              User 2
            </button>
            <button
              onClick={() => quickLogin('user3', 'user123')}
              className="quick-button user"
              disabled={loading}
            >
              User 3
            </button>
          </div>
        </div>

        <div className="login-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Admin: admin / admin123</p>
          <p>Users: user1, user2, user3 / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
