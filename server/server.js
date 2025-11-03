import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Novu } from '@novu/node';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Novu
const novu = new Novu(process.env.NOVU_API_KEY, {
  backendUrl: process.env.NOVU_BACKEND_URL
});

// Middleware
app.use(cors());
app.use(express.json());

// Mock users database
const MOCK_USERS = {
  admin: {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    email: 'mohamedhalith.smh@gmail.com',
    subscriberId: 'admin-001'
  },
  user1: {
    id: 'user-001',
    username: 'user1',
    password: 'user123',
    role: 'guest',
    email: 'user1@example.com',
    subscriberId: 'user-001'
  },
  user2: {
    id: 'user-002',
    username: 'user2',
    password: 'user123',
    role: 'guest',
    email: 'user2@example.com',
    subscriberId: 'user-002'
  },
  user3: {
    id: 'user-003',
    username: 'user3',
    password: 'user123',
    role: 'guest',
    email: 'user3@example.com',
    subscriberId: 'user-003'
  }
};

// Mock tasks database (10 tasks per user)
const MOCK_TASKS = {};

// Initialize tasks for each guest user
Object.values(MOCK_USERS)
  .filter(user => user.role === 'guest')
  .forEach(user => {
    MOCK_TASKS[user.id] = Array.from({ length: 10 }, (_, index) => ({
      id: `${user.id}-task-${index + 1}`,
      userId: user.id,
      title: `Task ${index + 1}`,
      description: `Description for task ${index + 1}`,
      status: 'pending', // pending, in-progress, completed
      createdAt: new Date().toISOString()
    }));
  });

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const user = Object.values(MOCK_USERS).find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      subscriberId: user.subscriberId,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      subscriberId: user.subscriberId
    }
  });
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ==================== NOVU ROUTES ====================

// Create/Update subscriber in Novu
app.post('/api/novu/subscriber', authenticateToken, async (req, res) => {
  try {
    await novu.subscribers.identify(req.user.subscriberId, {
      email: req.user.email,
      firstName: req.user.username,
      lastName: req.user.role,
      data: {
        role: req.user.role,
        userId: req.user.id
      }
    });

    res.json({ message: 'Subscriber created/updated successfully' });
  } catch (error) {
    console.error('Error creating subscriber:', error);
    res.status(500).json({ error: 'Failed to create subscriber', details: error.message });
  }
});

// Get subscriber notifications feed
app.get('/api/novu/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await novu.subscribers.getNotificationsFeed(
      req.user.subscriberId,
      {
        page: 0,
        limit: 50
      }
    );

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
  }
});

// Mark notification as read
app.post('/api/novu/notifications/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    await novu.subscribers.markMessageAs(
      req.user.subscriberId,
      messageId,
      { seen: true, read: true }
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read', details: error.message });
  }
});

// ==================== TASK ROUTES ====================

// Get all tasks for current user
app.get('/api/tasks', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    // Admin can see all tasks
    const allTasks = Object.values(MOCK_TASKS).flat();
    res.json({ tasks: allTasks });
  } else {
    // Guest users see only their tasks
    const userTasks = MOCK_TASKS[req.user.id] || [];
    res.json({ tasks: userTasks });
  }
});

// Get task by ID
app.get('/api/tasks/:taskId', authenticateToken, (req, res) => {
  const { taskId } = req.params;

  const allTasks = Object.values(MOCK_TASKS).flat();
  const task = allTasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Check permissions
  if (req.user.role !== 'admin' && task.userId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to view this task' });
  }

  res.json({ task });
});

// Update task status
app.patch('/api/tasks/:taskId/status', authenticateToken, async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!['pending', 'in-progress', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const allTasks = Object.values(MOCK_TASKS).flat();
  const task = allTasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Check permissions - only task owner can update
  if (task.userId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to update this task' });
  }

  const oldStatus = task.status;
  task.status = status;
  task.updatedAt = new Date().toISOString();

  // If task is marked as completed, trigger notification to admin
  if (status === 'completed' && oldStatus !== 'completed') {
    try {
      const adminUser = MOCK_USERS.admin;

      await novu.trigger('task-completed-notification', {
        to: {
          subscriberId: adminUser.subscriberId,
          email: adminUser.email
        },
        payload: {
          taskId: task.id,
          taskTitle: task.title,
          taskDescription: task.description,
          userName: req.user.username,
          userId: req.user.id,
          completedAt: task.updatedAt,
          message: `${req.user.username} has completed task: ${task.title}`
        }
      });

      console.log(`Notification sent to admin for task completion: ${task.title}`);
    } catch (error) {
      console.error('Error sending notification:', error);
      // Don't fail the request if notification fails
    }
  }

  res.json({
    task,
    message: status === 'completed' ? 'Task completed and notification sent to admin' : 'Task status updated'
  });
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    novu: {
      configured: !!process.env.NOVU_API_KEY,
      backendUrl: process.env.NOVU_BACKEND_URL
    }
  });
});

// Get all users (for testing)
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const users = Object.values(MOCK_USERS).map(({ password, ...user }) => user);
  res.json({ users });
});

// Start server
app.listen(PORT, () => {
  console.log(`
TPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPW
Q          Novu POC Server Running                         Q
ZPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP]

Server:     http://localhost:${PORT}
Novu:       ${process.env.NOVU_BACKEND_URL || 'Not configured'}

Mock Users:
-----------
Admin:
  Username: admin
  Password: admin123

Guest Users:
  Username: user1, Password: user123
  Username: user2, Password: user123
  Username: user3, Password: user123

API Endpoints:
--------------
POST   /api/auth/login
GET    /api/auth/me
POST   /api/novu/subscriber
GET    /api/novu/notifications
POST   /api/novu/notifications/:messageId/read
GET    /api/tasks
GET    /api/tasks/:taskId
PATCH  /api/tasks/:taskId/status
GET    /api/health
GET    /api/users

Ready to receive requests!
  `);
});
