import React, { useState } from 'react';
import './TaskCard.css';

const TaskCard = ({ task, userRole, userId, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const canUpdateTask = userRole === 'guest' && task.userId === userId;

  const handleStatusChange = async (newStatus) => {
    if (!canUpdateTask || isUpdating) return;

    setIsUpdating(true);
    try {
      await onStatusChange(task.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in-progress':
        return '🔄';
      case 'completed':
        return '✅';
      default:
        return '📝';
    }
  };

  return (
    <div className={`task-card ${task.status}`}>
      <div className="task-card-header">
        <div className="task-icon">{getStatusIcon(task.status)}</div>
        <div className="task-status-badge" data-status={task.status}>
          {task.status.replace('-', ' ')}
        </div>
      </div>

      <div className="task-card-body">
        <h4 className="task-title">{task.title}</h4>
        <p className="task-description">{task.description}</p>

        {userRole === 'admin' && (
          <div className="task-user-info">
            <span>👤 {task.userId}</span>
          </div>
        )}

        <div className="task-meta">
          <span className="task-date">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </span>
          {task.updatedAt && (
            <span className="task-date">
              Updated: {new Date(task.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {canUpdateTask && (
        <div className="task-card-footer">
          <div className="task-actions">
            <button
              className="status-button pending"
              onClick={() => handleStatusChange('pending')}
              disabled={isUpdating || task.status === 'pending'}
            >
              ⏳ Pending
            </button>
            <button
              className="status-button in-progress"
              onClick={() => handleStatusChange('in-progress')}
              disabled={isUpdating || task.status === 'in-progress'}
            >
              🔄 In Progress
            </button>
            <button
              className="status-button completed"
              onClick={() => handleStatusChange('completed')}
              disabled={isUpdating || task.status === 'completed'}
            >
              ✅ Complete
            </button>
          </div>
          {task.status === 'completed' && (
            <div className="completion-note">
              🎉 Notification sent to admin!
            </div>
          )}
        </div>
      )}

      {userRole === 'admin' && task.status === 'completed' && (
        <div className="admin-note">
          ✅ This task was completed
        </div>
      )}
    </div>
  );
};

export default TaskCard;
