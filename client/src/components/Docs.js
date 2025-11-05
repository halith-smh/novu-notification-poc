import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mermaid from 'mermaid';
import './Docs.css';

const Docs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'monospace',
      suppressErrors: false
    });

    // Render all mermaid diagrams after DOM is ready
    const renderDiagrams = async () => {
      try {
        // Small delay to ensure DOM is fully ready
        setTimeout(async () => {
          await mermaid.run({
            querySelector: '.mermaid',
            suppressErrors: false
          });
        }, 100);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    };

    renderDiagrams();
  }, []);

  const goBack = () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="docs-container">
      <div className="docs-header">
        <button onClick={goBack} className="back-button">
          ← Back
        </button>
        <h1>📚 Novu POC - Technical Documentation</h1>
        <p className="docs-subtitle">Complete guide to the Novu notification system implementation</p>
      </div>

      <div className="docs-content">
        {/* Table of Contents */}
        <section className="docs-section">
          <h2>📑 Table of Contents</h2>
          <ul className="toc">
            <li><a href="#overview">System Overview</a></li>
            <li><a href="#architecture">Architecture</a></li>
            <li><a href="#setup">Setup & Configuration</a></li>
            <li><a href="#api">API Endpoints</a></li>
            <li><a href="#novu">Novu Integration</a></li>
            <li><a href="#workflows">Notification Workflows</a></li>
            <li><a href="#authentication">Authentication</a></li>
            <li><a href="#components">React Components</a></li>
            <li><a href="#testing">Testing Guide</a></li>
          </ul>
        </section>

        {/* System Overview */}
        <section id="overview" className="docs-section">
          <h2>🎯 System Overview</h2>
          <p>
            This POC demonstrates a complete task management system with real-time notifications using Novu.
            The system includes JWT-based authentication, role-based access control, and in-app notifications.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li>✅ JWT Authentication with 4 mock users (1 admin + 3 guests)</li>
            <li>✅ Role-Based Access Control (RBAC)</li>
            <li>✅ Task Management (30 tasks: 10 per guest user)</li>
            <li>✅ Real-time In-App Notifications via Novu</li>
            <li>✅ WebSocket-based live updates</li>
            <li>✅ Responsive React UI with modern design</li>
          </ul>

          <h3>Technology Stack</h3>
          <div className="tech-stack">
            <div className="tech-card">
              <h4>Backend</h4>
              <ul>
                <li>Node.js + Express.js</li>
                <li>@novu/node v2.0.0</li>
                <li>JWT (jsonwebtoken)</li>
                <li>CORS, dotenv</li>
              </ul>
            </div>
            <div className="tech-card">
              <h4>Frontend</h4>
              <ul>
                <li>React 18</li>
                <li>@novu/react v2.x</li>
                <li>Axios (HTTP client)</li>
                <li>React Router</li>
              </ul>
            </div>
            <div className="tech-card">
              <h4>Infrastructure</h4>
              <ul>
                <li>Novu (Docker)</li>
                <li>MongoDB (Novu data)</li>
                <li>Redis (Novu cache)</li>
                <li>WebSocket (port 3002)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Architecture Diagram */}
        <section id="architecture" className="docs-section">
          <h2>🏗️ System Architecture</h2>

          <h3>High-Level Architecture</h3>
          <div className="mermaid">
{`graph TB
    subgraph Browser["Browser"]
        RC["React Client<br/>Port 3000/3001"]
        NC["Novu Inbox<br/>Component"]
    end

    subgraph Backend["Express Server Port 5000"]
        API[REST API]
        AUTH["JWT Auth<br/>Middleware"]
        NOVU_SDK["@novu/node<br/>SDK"]
    end

    subgraph NovuStack["Novu Docker Localhost"]
        NOVU_API["Novu API<br/>Port 3000"]
        NOVU_WS["WebSocket<br/>Port 3002"]
        WORKFLOW[Workflow Engine]
        STORE[Notification Store]
        MONGO[(MongoDB)]
        REDIS[(Redis)]
    end

    RC -->|HTTP/REST| API
    API -->|Verify| AUTH
    AUTH -->|Trigger| NOVU_SDK
    NOVU_SDK -->|HTTP| NOVU_API
    NOVU_API --> WORKFLOW
    WORKFLOW --> STORE
    STORE --> MONGO
    STORE --> REDIS
    NOVU_WS -->|Real-time| NC
    NC -->|Subscribe| NOVU_API

    style Browser fill:#e1f5ff
    style Backend fill:#fff3e0
    style NovuStack fill:#f3e5f5`}
          </div>

          <h3>Notification Flow</h3>
          <div className="mermaid">
{`sequenceDiagram
    participant U as User 1 (Guest)
    participant API as Express API
    participant NS as Novu SDK
    participant NB as Novu Backend
    participant A as Admin (Dashboard)

    U->>API: PATCH /api/tasks/:id/status
    Note right of U: status: completed
    API->>API: Validate JWT Token
    API->>API: Check Task Ownership
    API->>API: Update Task Status

    API->>NS: novu.trigger('task-completed')
    NS->>NB: POST /v1/events/trigger
    NB->>NB: Process Workflow
    NB->>NB: Render Template
    NB->>NB: Store Notification

    NB-->>A: WebSocket Push (Real-time)
    A->>A: Show Notification Badge
    A->>A: Display in Inbox

    API-->>U: 200 OK
    Note left of API: Notification sent`}
          </div>

          <h3>Authentication Flow</h3>
          <div className="mermaid">
{`sequenceDiagram
    participant C as Client
    participant API as Express API
    participant DB as Mock DB

    C->>API: POST /api/auth/login
    Note right of C: username, password
    API->>DB: Find User
    DB-->>API: User Object
    API->>API: Generate JWT Token
    Note right of API: expires: 24h
    API-->>C: token, user
    C->>C: Store in localStorage

    Note over C: Subsequent Requests

    C->>API: GET /api/tasks
    Note right of C: Authorization: Bearer token
    API->>API: Verify JWT
    API->>API: Extract User Info
    API->>DB: Fetch User Tasks
    DB-->>API: Tasks Array
    API-->>C: tasks`}
          </div>
        </section>

        {/* Setup & Configuration */}
        <section id="setup" className="docs-section">
          <h2>⚙️ Setup & Configuration</h2>

          <h3>Prerequisites</h3>
          <ul>
            <li>Node.js v16+ installed</li>
            <li>Docker running with Novu containers</li>
            <li>Ports available: 3000, 3001, 5000</li>
          </ul>

          <h3>Environment Variables</h3>

          <h4>Server (.env)</h4>
          <pre className="code-block">
{`# Novu Configuration
NOVU_API_KEY=your_api_key_from_dashboard
NOVU_BACKEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=mock_jwt_secret_for_poc_demo_2024

# Server Port
PORT=5000`}
          </pre>

          <h4>Client (.env)</h4>
          <pre className="code-block">
{`# Backend API
REACT_APP_API_URL=http://localhost:5000

# Novu Application Identifier
REACT_APP_NOVU_APP_ID=your_application_identifier_here`}
          </pre>

          <h3>Installation Steps</h3>
          <ol>
            <li>
              <strong>Start Novu (Docker):</strong>
              <pre className="code-block">{`cd novu/docker/community
docker-compose up -d`}</pre>
            </li>
            <li>
              <strong>Get Novu Credentials:</strong>
              <ul>
                <li>Open: http://localhost:4200</li>
                <li>Settings → API Keys</li>
                <li>Copy: API Key & Application Identifier</li>
              </ul>
            </li>
            <li>
              <strong>Create Workflow:</strong>
              <ul>
                <li>Workflows → Create Workflow</li>
                <li>Identifier: <code>task-completed</code></li>
                <li>Add In-App step with template: <code>{'{{message}}'}</code></li>
              </ul>
            </li>
            <li>
              <strong>Install Server:</strong>
              <pre className="code-block">{`cd server
npm install
npm start`}</pre>
            </li>
            <li>
              <strong>Install Client:</strong>
              <pre className="code-block">{`cd client
npm install
npm start`}</pre>
            </li>
          </ol>
        </section>

        {/* API Endpoints */}
        <section id="api" className="docs-section">
          <h2>🔌 API Endpoints</h2>

          <h3>Authentication</h3>
          <div className="api-endpoint">
            <div className="api-method post">POST</div>
            <code>/api/auth/login</code>
            <p>Authenticate user and receive JWT token</p>
            <pre className="code-block">
{`// Request
{
  "username": "admin",
  "password": "admin123"
}

// Response
{
  "token": "eyJhbGci...",
  "user": {
    "id": "admin-001",
    "username": "admin",
    "role": "admin",
    "email": "admin@example.com",
    "subscriberId": "admin-001"
  }
}`}
            </pre>
          </div>

          <div className="api-endpoint">
            <div className="api-method get">GET</div>
            <code>/api/auth/me</code>
            <p>Get current authenticated user</p>
            <pre className="code-block">
{`// Headers
Authorization: Bearer <token>

// Response
{
  "user": {
    "id": "admin-001",
    "username": "admin",
    "role": "admin"
  }
}`}
            </pre>
          </div>

          <h3>Tasks</h3>
          <div className="api-endpoint">
            <div className="api-method get">GET</div>
            <code>/api/tasks</code>
            <p>Get all tasks (filtered by role)</p>
            <pre className="code-block">
{`// Response (Admin - sees all 30 tasks)
{
  "tasks": [
    {
      "id": "user-001-task-1",
      "userId": "user-001",
      "title": "Task 1",
      "status": "pending",
      "createdAt": "2024-11-03T..."
    }
  ]
}

// Response (Guest - sees only own 10 tasks)
{
  "tasks": [...] // Only tasks for current user
}`}
            </pre>
          </div>

          <div className="api-endpoint">
            <div className="api-method patch">PATCH</div>
            <code>/api/tasks/:taskId/status</code>
            <p>Update task status and trigger notification</p>
            <pre className="code-block">
{`// Request
{
  "status": "completed" // pending | in-progress | completed
}

// Response
{
  "task": {
    "id": "user-001-task-1",
    "status": "completed",
    "updatedAt": "2024-11-03T..."
  },
  "message": "Task completed and notification sent to admin"
}`}
            </pre>
          </div>

          <h3>Novu</h3>
          <div className="api-endpoint">
            <div className="api-method post">POST</div>
            <code>/api/novu/subscriber</code>
            <p>Create/update Novu subscriber</p>
          </div>

          <div className="api-endpoint">
            <div className="api-method get">GET</div>
            <code>/api/novu/notifications</code>
            <p>Get notification feed for current user</p>
          </div>
        </section>

        {/* Novu Integration */}
        <section id="novu" className="docs-section">
          <h2>📬 Novu Integration</h2>

          <h3>Server-Side (Node.js)</h3>
          <pre className="code-block">
{`import { Novu } from '@novu/node';

// Initialize
const novu = new Novu(process.env.NOVU_API_KEY, {
  backendUrl: process.env.NOVU_BACKEND_URL
});

// Create Subscriber
await novu.subscribers.identify(subscriberId, {
  email: user.email,
  firstName: user.username,
  data: { role: user.role }
});

// Trigger Notification
await novu.trigger('task-completed', {
  to: {
    subscriberId: 'admin-001',
    email: 'admin@example.com'
  },
  payload: {
    taskId: task.id,
    taskTitle: task.title,
    userName: user.username,
    message: \`\${user.username} completed \${task.title}\`
  }
});`}
          </pre>

          <h3>Client-Side (React)</h3>
          <pre className="code-block">
{`import { NovuProvider, Inbox } from '@novu/react';

function Dashboard({ user }) {
  return (
    <NovuProvider
      subscriberId={user.subscriberId}
      applicationIdentifier={process.env.REACT_APP_NOVU_APP_ID}
      backendUrl="http://localhost:3000"
      socketUrl="ws://localhost:3002"
    >
      <Inbox />
    </NovuProvider>
  );
}`}
          </pre>

          <h3>Novu Configuration</h3>
          <ul>
            <li><strong>Dashboard:</strong> http://localhost:4200</li>
            <li><strong>API:</strong> http://localhost:3000</li>
            <li><strong>WebSocket:</strong> ws://localhost:3002</li>
            <li><strong>Workflow ID:</strong> task-completed</li>
            <li><strong>Channel:</strong> In-App</li>
          </ul>
        </section>

        {/* Workflows */}
        <section id="workflows" className="docs-section">
          <h2>🔄 Notification Workflows</h2>

          <h3>Workflow: task-completed</h3>
          <div className="workflow-card">
            <h4>Configuration</h4>
            <ul>
              <li><strong>Identifier:</strong> task-completed</li>
              <li><strong>Name:</strong> Task Completed Notification</li>
              <li><strong>Trigger:</strong> Server API when task status = completed</li>
              <li><strong>Target:</strong> Admin user (subscriberId: admin-001)</li>
            </ul>

            <h4>Steps</h4>
            <ol>
              <li><strong>In-App Notification</strong>
                <ul>
                  <li>Template: <code>{'{{message}}'}</code></li>
                  <li>Variables: taskId, taskTitle, userName, userId, completedAt, message</li>
                </ul>
              </li>
            </ol>

            <h4>Payload Structure</h4>
            <pre className="code-block">
{`{
  "taskId": "user-001-task-1",
  "taskTitle": "Task 1",
  "taskDescription": "Description for task 1",
  "userName": "user1",
  "userId": "user-001",
  "completedAt": "2024-11-03T10:30:00.000Z",
  "message": "user1 has completed task: Task 1"
}`}
            </pre>
          </div>

          <h3>Workflow Diagram</h3>
          <div className="mermaid">
{`graph LR
    A[User Completes Task] --> B[API Validates]
    B --> C[Update Task Status]
    C --> D{Status = Completed?}
    D -->|Yes| E[Trigger Novu]
    D -->|No| F[Return Success]
    E --> G[Novu Processes]
    G --> H[Store Notification]
    H --> I[WebSocket Push]
    I --> J[Admin Receives]
    J --> K[Show Badge]
    K --> L[Display in Inbox]

    style A fill:#e3f2fd
    style E fill:#fff3e0
    style J fill:#f3e5f5`}
          </div>
        </section>

        {/* Authentication */}
        <section id="authentication" className="docs-section">
          <h2>🔐 Authentication</h2>

          <h3>JWT Implementation</h3>
          <p>The system uses JSON Web Tokens (JWT) for stateless authentication.</p>

          <h4>Token Generation</h4>
          <pre className="code-block">
{`const token = jwt.sign(
  {
    id: user.id,
    username: user.username,
    role: user.role,
    subscriberId: user.subscriberId,
    email: user.email
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);`}
          </pre>

          <h4>Token Validation Middleware</h4>
          <pre className="code-block">
{`const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};`}
          </pre>

          <h3>Mock Users</h3>
          <table className="docs-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>Role</th>
                <th>Subscriber ID</th>
                <th>Tasks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>admin</td>
                <td>admin123</td>
                <td>admin</td>
                <td>admin-001</td>
                <td>View all (30)</td>
              </tr>
              <tr>
                <td>user1</td>
                <td>user123</td>
                <td>guest</td>
                <td>user-001</td>
                <td>10 own tasks</td>
              </tr>
              <tr>
                <td>user2</td>
                <td>user123</td>
                <td>guest</td>
                <td>user-002</td>
                <td>10 own tasks</td>
              </tr>
              <tr>
                <td>user3</td>
                <td>user123</td>
                <td>guest</td>
                <td>user-003</td>
                <td>10 own tasks</td>
              </tr>
            </tbody>
          </table>

          <h3>Authorization Rules</h3>
          <ul>
            <li><strong>Admin:</strong> Can view all tasks (read-only), receives all notifications</li>
            <li><strong>Guest:</strong> Can view and update only their own tasks</li>
            <li><strong>Task Updates:</strong> Only task owner can change status</li>
            <li><strong>Notifications:</strong> Only sent to admin when task completed</li>
          </ul>
        </section>

        {/* React Components */}
        <section id="components" className="docs-section">
          <h2>⚛️ React Components</h2>

          <h3>Component Tree</h3>
          <div className="mermaid">
{`graph TD
    A[App.js] --> B{User Authenticated?}
    B -->|No| C[Login.js]
    B -->|Yes| D[Dashboard.js]
    D --> E[Header]
    D --> F[TaskList.js]
    F --> G[TaskCard.js]
    E --> H[NovuProvider]
    H --> I[Inbox]

    C --> J[Login Form]
    C --> K[Quick Login Buttons]

    style A fill:#e1f5ff
    style D fill:#fff3e0
    style H fill:#f3e5f5`}
          </div>

          <h3>Component Descriptions</h3>

          <div className="component-card">
            <h4>App.js</h4>
            <p>Root component managing authentication state and routing</p>
            <ul>
              <li>Checks localStorage for existing token</li>
              <li>Validates token on mount</li>
              <li>Routes between Login and Dashboard</li>
            </ul>
          </div>

          <div className="component-card">
            <h4>Login.js</h4>
            <p>Authentication interface with form and quick login</p>
            <ul>
              <li>Username/password form</li>
              <li>Quick login buttons for demo users</li>
              <li>Error handling and validation</li>
              <li>Stores JWT in localStorage</li>
            </ul>
          </div>

          <div className="component-card">
            <h4>Dashboard.js</h4>
            <p>Main application dashboard with tasks and notifications</p>
            <ul>
              <li>NovuProvider configuration</li>
              <li>Inbox notification component</li>
              <li>Task loading and display</li>
              <li>Role-based UI rendering</li>
            </ul>
          </div>

          <div className="component-card">
            <h4>TaskList.js</h4>
            <p>Container for displaying and organizing tasks</p>
            <ul>
              <li>Groups tasks by user (admin view)</li>
              <li>Task statistics (pending/in-progress/completed)</li>
              <li>Responsive grid layout</li>
            </ul>
          </div>

          <div className="component-card">
            <h4>TaskCard.js</h4>
            <p>Individual task display with status controls</p>
            <ul>
              <li>Task details (title, description, dates)</li>
              <li>Status badge and icon</li>
              <li>Action buttons (pending/in-progress/completed)</li>
              <li>Completion notification message</li>
            </ul>
          </div>
        </section>

        {/* Testing Guide */}
        <section id="testing" className="docs-section">
          <h2>🧪 Testing Guide</h2>

          <h3>Quick Test (2 minutes)</h3>
          <ol>
            <li>Open two browser windows (or use one normal + one incognito)</li>
            <li><strong>Window 1:</strong> Login as admin (admin/admin123)</li>
            <li><strong>Window 2:</strong> Login as user1 (user1/user123)</li>
            <li><strong>Window 2:</strong> Click "✅ Complete" on any task</li>
            <li><strong>Window 1:</strong> Check the Inbox - notification should appear!</li>
          </ol>

          <h3>Test Scenarios</h3>

          <div className="test-scenario">
            <h4>✅ Authentication Flow</h4>
            <ul>
              <li>Valid login with correct credentials</li>
              <li>Invalid login with wrong credentials</li>
              <li>Token persistence across page refresh</li>
              <li>Logout and token clearing</li>
            </ul>
          </div>

          <div className="test-scenario">
            <h4>✅ Task Management</h4>
            <ul>
              <li>Guest user sees only their 10 tasks</li>
              <li>Admin sees all 30 tasks from all users</li>
              <li>Update task status: pending → in-progress → completed</li>
              <li>Task counters update correctly</li>
            </ul>
          </div>

          <div className="test-scenario">
            <h4>✅ Notifications</h4>
            <ul>
              <li>Notification sent when task completed</li>
              <li>Admin receives notification in real-time</li>
              <li>Inbox shows correct task details</li>
              <li>Multiple notifications accumulate</li>
              <li>Notification badge shows correct count</li>
            </ul>
          </div>

          <div className="test-scenario">
            <h4>✅ Authorization</h4>
            <ul>
              <li>Guest cannot update other users' tasks</li>
              <li>Admin cannot modify tasks (read-only)</li>
              <li>Protected routes require authentication</li>
            </ul>
          </div>

          <h3>Common Issues</h3>
          <table className="docs-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Cause</th>
                <th>Solution</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>workflow_not_found</td>
                <td>Workflow ID mismatch</td>
                <td>Check identifier is exactly: task-completed</td>
              </tr>
              <tr>
                <td>No notifications</td>
                <td>Wrong App ID</td>
                <td>Verify REACT_APP_NOVU_APP_ID in .env</td>
              </tr>
              <tr>
                <td>401 Unauthorized</td>
                <td>Missing/invalid token</td>
                <td>Re-login to get fresh token</td>
              </tr>
              <tr>
                <td>CORS error</td>
                <td>Server not running</td>
                <td>Start Express server on port 5000</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <section className="docs-footer">
          <p>📝 Last Updated: November 2025 | Version 1.0.0</p>
          <p>
            <a href="https://docs.novu.co" target="_blank" rel="noopener noreferrer">
              Novu Official Documentation →
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Docs;
