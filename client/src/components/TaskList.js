import React from 'react';
import TaskCard from './TaskCard';
import './TaskList.css';

const TaskList = ({ tasks, userRole, userId, onStatusChange }) => {
  // Group tasks by user if admin
  const groupedTasks = userRole === 'admin'
    ? tasks.reduce((acc, task) => {
        const userKey = task.userId;
        if (!acc[userKey]) {
          acc[userKey] = [];
        }
        acc[userKey].push(task);
        return acc;
      }, {})
    : { [userId]: tasks };

  const getStatusCount = (tasks) => {
    return {
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };
  };

  if (tasks.length === 0) {
    return (
      <div className="no-tasks">
        <p>No tasks available</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      {Object.entries(groupedTasks).map(([userKey, userTasks]) => {
        const counts = getStatusCount(userTasks);

        return (
          <div key={userKey} className="user-task-section">
            {userRole === 'admin' && (
              <div className="user-section-header">
                <h3>User: {userTasks[0]?.userId || userKey}</h3>
                <div className="task-stats">
                  <span className="stat pending">
                    Pending: {counts.pending}
                  </span>
                  <span className="stat in-progress">
                    In Progress: {counts.inProgress}
                  </span>
                  <span className="stat completed">
                    Completed: {counts.completed}
                  </span>
                </div>
              </div>
            )}

            {userRole !== 'admin' && (
              <div className="task-overview">
                <div className="overview-card">
                  <div className="overview-icon pending">⏳</div>
                  <div className="overview-content">
                    <div className="overview-number">{counts.pending}</div>
                    <div className="overview-label">Pending</div>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="overview-icon in-progress">🔄</div>
                  <div className="overview-content">
                    <div className="overview-number">{counts.inProgress}</div>
                    <div className="overview-label">In Progress</div>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="overview-icon completed">✅</div>
                  <div className="overview-content">
                    <div className="overview-number">{counts.completed}</div>
                    <div className="overview-label">Completed</div>
                  </div>
                </div>
              </div>
            )}

            <div className="tasks-grid">
              {userTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  userRole={userRole}
                  userId={userId}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
