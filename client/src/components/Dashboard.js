import React, { useState, useEffect } from 'react';
import { taskAPI, novuAPI } from '../services/api';
import { NovuProvider, Inbox } from '@novu/react';
import TaskList from './TaskList';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
    // Create/update subscriber in Novu
    createNovuSubscriber();
  }, []);

  const createNovuSubscriber = async () => {
    try {
      await novuAPI.createSubscriber();
      console.log('Novu subscriber created/updated');
    } catch (err) {
      console.error('Error creating Novu subscriber:', err);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAllTasks();
      setTasks(response.data.tasks);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTaskStatus(taskId, newStatus);
      // Reload tasks to get updated data
      await loadTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  const novuAppId = process.env.REACT_APP_NOVU_APP_ID;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Novu POC - Task Manager</h1>
          <span className="user-role-badge" data-role={user.role}>
            {user.role === 'admin' ? '👑 Admin' : '👤 Guest User'}
          </span>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="username">{user.username}</span>
            <span className="user-email">{user.email}</span>
          </div>

          {novuAppId && novuAppId !== 'your_novu_application_identifier_here' ? (
            <NovuProvider
              subscriberId={user.subscriberId}
              applicationIdentifier={novuAppId}
              backendUrl="http://localhost:3000"
              socketUrl="ws://localhost:3002"
            >
              <Inbox />
            </NovuProvider>
          ) : (
            <div className="notification-placeholder" title="Configure NOVU_APP_ID in .env">
              🔔
            </div>
          )}

          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {user.role === 'admin' ? (
          <div className="admin-info">
            <h2>📊 Admin Dashboard</h2>
            <p>You can view all tasks from all users below.</p>
            <p>You will receive in-app notifications when users complete their tasks.</p>
          </div>
        ) : (
          <div className="user-info-banner">
            <h2>📝 Your Tasks</h2>
            <p>Complete tasks to send notifications to the admin.</p>
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            userRole={user.role}
            userId={user.id}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
