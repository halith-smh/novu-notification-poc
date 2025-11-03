# Novu Notification System POC

A complete Proof of Concept (POC) for Novu notification system with task management. This project demonstrates real-time in-app notifications using Novu, with React frontend and Express backend.

## Features

- **User Authentication**: Mock JWT-based authentication with multiple user roles
- **Role-Based Access**: Admin and Guest user roles with different permissions
- **Task Management**: 10 tasks per user with status tracking (Pending, In-Progress, Completed)
- **Real-Time Notifications**: In-app notifications via Novu when tasks are completed
- **Novu Integration**: Complete integration with notification center

## Tech Stack

### Backend
- Node.js + Express.js
- @novu/node SDK
- JWT authentication
- In-memory mock database

### Frontend
- React.js
- @novu/notification-center
- Axios for API calls
- CSS3 for styling

## Project Structure

```
poc 031125 v3/
├── server/
│   ├── server.js           # Express server with all routes
│   ├── package.json        # Server dependencies
│   ├── .env               # Server environment variables
│   └── .env.example       # Example environment file
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js          # Login component
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.js      # Main dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── TaskList.js       # Task list container
│   │   │   ├── TaskList.css
│   │   │   ├── TaskCard.js       # Individual task card
│   │   │   └── TaskCard.css
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.js               # Main App component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json             # Client dependencies
│   ├── .env                     # Client environment variables
│   └── .env.example             # Example environment file
└── README.md                     # This file
```

## Prerequisites

1. **Docker**: Novu running via Docker
2. **Node.js**: Version 16+ recommended
3. **npm**: Package manager

## Setup Instructions

### Step 1: Start Novu (Already Running)

You already have Novu running via Docker. Verify it's accessible at:
- Dashboard: http://localhost:4200
- API: http://localhost:3000

### Step 2: Configure Novu

1. Open Novu Dashboard at http://localhost:4200
2. Sign up or login
3. Go to **Settings → API Keys**
4. Copy the following:
   - **API Key** (for backend)
   - **Application Identifier** (for frontend)

### Step 3: Create Novu Workflow

1. In Novu Dashboard, go to **Workflows**
2. Click **"Create Workflow"**
3. Use these settings:
   - **Name**: `task-completed`
   - **Identifier**: `task-completed` (IMPORTANT: must match exactly)
   - **Description**: Task completion notification

4. Add an **In-App** notification step:
   - Click **"Add Step"** → Select **"In-App"**
   - Configure the template:
     - **Content**: `{{message}}`
     - You can also use:
       - `Task: {{taskTitle}}`
       - `User: {{userName}} has completed {{taskTitle}}`
       - `Description: {{taskDescription}}`

5. **Save** the workflow

### Step 4: Configure Backend

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update `.env` file with your Novu API Key:
   ```env
   NOVU_API_KEY=your_actual_api_key_from_novu_dashboard
   NOVU_BACKEND_URL=http://localhost:3000
   JWT_SECRET=mock_jwt_secret_for_poc_demo_2024
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The server will start at http://localhost:5000

### Step 5: Configure Frontend

1. Navigate to client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update `.env` file with your Novu Application Identifier:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_NOVU_APP_ID=your_actual_application_identifier
   ```

4. Start the React app:
   ```bash
   npm start
   ```

The app will open at http://localhost:3000

## Mock Users

The system comes with pre-configured mock users:

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Admin (can view all tasks, receives notifications)

### Guest Users
- **Username**: `user1` | **Password**: `user123`
- **Username**: `user2` | **Password**: `user123`
- **Username**: `user3` | **Password**: `user123`
- **Role**: Guest (can manage their own tasks)

Each guest user has **10 tasks** by default.

## Testing the Notification Flow

1. **Login as Admin**:
   - Username: `admin`
   - Password: `admin123`
   - Notice the notification bell in the header

2. **Open a new browser window/tab** (or use incognito mode)

3. **Login as User1**:
   - Username: `user1`
   - Password: `user123`

4. **Complete a Task**:
   - Click any task's "✅ Complete" button
   - You'll see "Notification sent to admin!"

5. **Switch to Admin Tab**:
   - Check the notification bell (should show a badge)
   - Click the bell to see the notification
   - You'll see: "user1 has completed task: Task X"

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `GET /api/auth/me` - Get current user info

### Tasks
- `GET /api/tasks` - Get all tasks (filtered by role)
- `GET /api/tasks/:taskId` - Get specific task
- `PATCH /api/tasks/:taskId/status` - Update task status

### Novu
- `POST /api/novu/subscriber` - Create/update Novu subscriber
- `GET /api/novu/notifications` - Get notification feed
- `POST /api/novu/notifications/:messageId/read` - Mark as read

### Health & Users
- `GET /api/health` - Health check
- `GET /api/users` - Get all users (admin only)

## How It Works

1. **User Authentication**: Users login with JWT tokens
2. **Subscriber Creation**: On login, user is registered as Novu subscriber
3. **Task Status Update**: When a guest user marks a task as "completed"
4. **Notification Trigger**: Server triggers Novu workflow `task-completed`
5. **Real-Time Delivery**: Admin receives in-app notification via Novu
6. **Notification Display**: Admin sees notification in notification center

## Workflow Payload

When a task is completed, the following payload is sent to Novu:

```javascript
{
  taskId: "user-001-task-1",
  taskTitle: "Task 1",
  taskDescription: "Description for task 1",
  userName: "user1",
  userId: "user-001",
  completedAt: "2024-11-03T10:30:00.000Z",
  message: "user1 has completed task: Task 1"
}
```

You can use these variables in your Novu workflow template.

## Troubleshooting

### Notifications Not Working?

1. **Check Workflow ID**: Ensure workflow identifier is exactly `task-completed`
2. **Check API Key**: Verify NOVU_API_KEY in server/.env
3. **Check App ID**: Verify REACT_APP_NOVU_APP_ID in client/.env
4. **Check Backend URL**: Ensure NOVU_BACKEND_URL is http://localhost:3000
5. **Check Console**: Look for errors in browser console and server logs
6. **Subscriber Creation**: Check if subscriber was created successfully

### Server Won't Start?

1. Check if port 5000 is already in use
2. Verify all dependencies are installed (`npm install`)
3. Check .env file exists with correct values

### Client Won't Start?

1. Check if port 3000 is already in use
2. Verify all dependencies are installed (`npm install`)
3. Check .env file exists with REACT_APP_NOVU_APP_ID

### CORS Issues?

The server is configured to accept requests from all origins. If you face CORS issues, check your browser console for specific errors.

## Features Demonstrated

✅ JWT Authentication with mock users
✅ Role-based access control (Admin & Guest)
✅ Task management with status tracking
✅ Novu workflow integration
✅ Real-time in-app notifications
✅ Notification center UI
✅ Mock database with 10 tasks per user
✅ Responsive design
✅ Clean, modern UI

## Next Steps / Enhancements

- Add email notifications
- Add SMS notifications via Novu
- Implement real database (MongoDB, PostgreSQL)
- Add task creation/deletion
- Add task assignment features
- Implement real user registration
- Add notification preferences
- Add notification sound/badges
- Deploy to production

## License

This is a POC/Demo project for learning purposes.

## Support

For issues with:
- **Novu**: https://docs.novu.co
- **This POC**: Check server and client logs for errors

---

**Happy Testing! 🚀**
