# Testing Checklist

## Pre-Testing Setup

### ✅ Prerequisites
- [ ] Novu Docker containers running
- [ ] Novu Dashboard accessible at http://localhost:4200
- [ ] Novu API accessible at http://localhost:3000
- [ ] Node.js installed (v16+)

### ✅ Configuration
- [ ] `server/.env` has valid NOVU_API_KEY
- [ ] `client/.env` has valid REACT_APP_NOVU_APP_ID
- [ ] Novu workflow created with identifier: `task-completed`
- [ ] Workflow has In-App notification step

### ✅ Installation
- [ ] Server dependencies installed (`cd server && npm install`)
- [ ] Client dependencies installed (`cd client && npm install`)

### ✅ Services Running
- [ ] Express server running at http://localhost:5000
- [ ] React app running at http://localhost:3000

---

## Test Cases

### 1️⃣ Authentication Tests

#### Test 1.1: Admin Login
- [ ] Navigate to http://localhost:3000
- [ ] Enter username: `admin`, password: `admin123`
- [ ] Click Login
- [ ] **Expected**: Redirected to dashboard
- [ ] **Expected**: Header shows "👑 Admin"
- [ ] **Expected**: Can see all users' tasks

#### Test 1.2: Guest User Login
- [ ] Navigate to http://localhost:3000
- [ ] Enter username: `user1`, password: `user123`
- [ ] Click Login
- [ ] **Expected**: Redirected to dashboard
- [ ] **Expected**: Header shows "👤 Guest User"
- [ ] **Expected**: Can see only own tasks (10 tasks)

#### Test 1.3: Quick Login Buttons
- [ ] Click "User 1" quick login button
- [ ] **Expected**: Credentials auto-filled
- [ ] Click Login
- [ ] **Expected**: Successful login

#### Test 1.4: Invalid Credentials
- [ ] Enter username: `wrong`, password: `wrong`
- [ ] Click Login
- [ ] **Expected**: Error message displayed
- [ ] **Expected**: Remains on login page

#### Test 1.5: Logout
- [ ] Login as any user
- [ ] Click "Logout" button
- [ ] **Expected**: Redirected to login page
- [ ] **Expected**: Token cleared from localStorage

---

### 2️⃣ Task Management Tests

#### Test 2.1: View Tasks (Guest User)
- [ ] Login as `user1`
- [ ] **Expected**: See 10 tasks
- [ ] **Expected**: See task overview cards (Pending/In-Progress/Completed)
- [ ] **Expected**: All tasks have status, title, description

#### Test 2.2: View All Tasks (Admin)
- [ ] Login as `admin`
- [ ] **Expected**: See tasks from all users (30 tasks total)
- [ ] **Expected**: Tasks grouped by user
- [ ] **Expected**: Each section shows user ID

#### Test 2.3: Update Task to In-Progress
- [ ] Login as `user1`
- [ ] Click "🔄 In Progress" button on any pending task
- [ ] **Expected**: Task status updates immediately
- [ ] **Expected**: Button becomes disabled
- [ ] **Expected**: Task overview counters update

#### Test 2.4: Update Task to Completed
- [ ] Login as `user1`
- [ ] Click "✅ Complete" button on any task
- [ ] **Expected**: Task status updates to "completed"
- [ ] **Expected**: See message: "Notification sent to admin!"
- [ ] **Expected**: Green completion badge appears

#### Test 2.5: Multiple Status Changes
- [ ] Login as `user1`
- [ ] Change Task 1: Pending → In Progress
- [ ] Change Task 2: Pending → Completed
- [ ] Change Task 3: Pending → In Progress → Completed
- [ ] **Expected**: All status changes work correctly
- [ ] **Expected**: Overview counters accurate

---

### 3️⃣ Notification Tests (Core Feature)

#### Test 3.1: Basic Notification Flow
**Setup**: Two browser windows (or one normal + one incognito)

**Window 1 - Admin**:
- [ ] Login as `admin`
- [ ] Note the notification bell (🔔)
- [ ] **Expected**: Bell has no badge initially

**Window 2 - User**:
- [ ] Login as `user1`
- [ ] Complete any task (click ✅ Complete)
- [ ] **Expected**: See "Notification sent to admin!"

**Back to Window 1 - Admin**:
- [ ] Wait 2-3 seconds
- [ ] **Expected**: Bell shows badge with count "1"
- [ ] Click the notification bell
- [ ] **Expected**: See notification: "user1 has completed task: Task X"

#### Test 3.2: Multiple Notifications
**Window 2 - User1**:
- [ ] Complete 3 different tasks

**Window 1 - Admin**:
- [ ] **Expected**: Badge shows "3"
- [ ] Click bell
- [ ] **Expected**: See 3 notifications listed
- [ ] **Expected**: All notifications show correct task titles

#### Test 3.3: Mark Notification as Read
**Window 1 - Admin**:
- [ ] Click notification bell
- [ ] Click on a notification
- [ ] **Expected**: Notification marked as read (UI changes)
- [ ] **Expected**: Badge count decreases

#### Test 3.4: Notifications from Multiple Users
**Window 2 - User1**:
- [ ] Login as `user1`
- [ ] Complete 1 task

**Window 3 - User2**:
- [ ] Login as `user2`
- [ ] Complete 1 task

**Window 1 - Admin**:
- [ ] **Expected**: Badge shows "2"
- [ ] Click bell
- [ ] **Expected**: See notifications from both user1 and user2
- [ ] **Expected**: Each notification shows correct username

#### Test 3.5: Real-Time Updates
**Window 1 - Admin**:
- [ ] Keep notification center OPEN (bell clicked)

**Window 2 - User**:
- [ ] Complete a task

**Window 1 - Admin**:
- [ ] **Expected**: New notification appears in real-time
- [ ] **Expected**: No page refresh needed

---

### 4️⃣ Role-Based Access Control Tests

#### Test 4.1: Admin Cannot Update Tasks
- [ ] Login as `admin`
- [ ] View any task
- [ ] **Expected**: No status update buttons visible
- [ ] **Expected**: Tasks are read-only

#### Test 4.2: User Cannot See Other Users' Tasks
- [ ] Login as `user1`
- [ ] **Expected**: Only see 10 tasks (own tasks)
- [ ] **Expected**: Cannot see user2 or user3 tasks

#### Test 4.3: User Cannot Update Others' Tasks
**Manual API Test**:
- [ ] Login as `user1`
- [ ] Get JWT token from localStorage
- [ ] Try to update user2's task via API
- [ ] **Expected**: 403 Forbidden error

---

### 5️⃣ UI/UX Tests

#### Test 5.1: Responsive Design
- [ ] Resize browser window to mobile size (< 768px)
- [ ] **Expected**: Layout adjusts properly
- [ ] **Expected**: All buttons remain accessible
- [ ] **Expected**: No horizontal scroll

#### Test 5.2: Task Card Hover Effects
- [ ] Hover over any task card
- [ ] **Expected**: Card lifts up (translateY effect)
- [ ] **Expected**: Shadow increases

#### Test 5.3: Button Disabled States
- [ ] Click any status button
- [ ] **Expected**: Button becomes disabled
- [ ] **Expected**: Button opacity changes
- [ ] **Expected**: Cursor shows "not-allowed"

#### Test 5.4: Loading States
- [ ] Refresh dashboard page
- [ ] **Expected**: See loading spinner briefly
- [ ] **Expected**: "Loading tasks..." message

---

### 6️⃣ API Tests (Manual/Postman)

#### Test 6.1: Health Check
```bash
GET http://localhost:5000/api/health
```
- [ ] **Expected**: Status 200
- [ ] **Expected**: Response shows Novu configured

#### Test 6.2: Login API
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```
- [ ] **Expected**: Returns JWT token
- [ ] **Expected**: Returns user object

#### Test 6.3: Get Tasks (Authenticated)
```bash
GET http://localhost:5000/api/tasks
Authorization: Bearer <your_token>
```
- [ ] **Expected**: Returns task array
- [ ] **Expected**: Filtered by user role

#### Test 6.4: Update Task Status
```bash
PATCH http://localhost:5000/api/tasks/user-001-task-1/status
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "status": "completed"
}
```
- [ ] **Expected**: Task status updated
- [ ] **Expected**: Response confirms notification sent

---

### 7️⃣ Error Handling Tests

#### Test 7.1: Invalid Task Status
- [ ] Try to update task with invalid status via API
- [ ] **Expected**: 400 Bad Request error

#### Test 7.2: Missing Authentication Token
- [ ] Call API without Authorization header
- [ ] **Expected**: 401 Unauthorized error

#### Test 7.3: Expired Token
- [ ] Modify token in localStorage to invalid value
- [ ] Refresh page
- [ ] **Expected**: Redirected to login page

#### Test 7.4: Network Error Simulation
- [ ] Stop Express server
- [ ] Try to login
- [ ] **Expected**: Error message displayed
- [ ] Start server again
- [ ] Retry login
- [ ] **Expected**: Login works

---

### 8️⃣ Novu Integration Tests

#### Test 8.1: Subscriber Creation
**Check Server Logs**:
- [ ] Login as any user
- [ ] **Expected**: Server log shows "Subscriber created/updated"

#### Test 8.2: Workflow Trigger
**Check Server Logs**:
- [ ] Complete a task as guest user
- [ ] **Expected**: Server log shows "Notification sent to admin for task completion"

#### Test 8.3: Novu Dashboard Verification
- [ ] Open http://localhost:4200
- [ ] Go to Activity Feed
- [ ] **Expected**: See triggered events
- [ ] **Expected**: Events show "task-completed" workflow

#### Test 8.4: Subscriber List
- [ ] In Novu Dashboard, go to Subscribers
- [ ] **Expected**: See admin-001, user-001, user-002, user-003
- [ ] **Expected**: Each subscriber has correct email

---

## Performance Tests

### 9️⃣ Load Tests

#### Test 9.1: Rapid Task Updates
- [ ] Login as `user1`
- [ ] Quickly update multiple tasks in succession
- [ ] **Expected**: All updates processed
- [ ] **Expected**: No errors
- [ ] **Expected**: Notifications sent for all completed tasks

#### Test 9.2: Multiple Concurrent Users
- [ ] Open 4 browser windows
- [ ] Login as admin, user1, user2, user3
- [ ] Have each user complete tasks simultaneously
- [ ] **Expected**: All operations succeed
- [ ] **Expected**: Admin receives all notifications

---

## Regression Tests (After Changes)

### 🔟 Post-Modification Checks

After making any code changes, verify:

- [ ] All users can login
- [ ] Tasks load correctly
- [ ] Status updates work
- [ ] Notifications are sent
- [ ] Admin receives notifications
- [ ] No console errors
- [ ] No server errors

---

## Bug Report Template

If you find issues, document them using this template:

```
**Bug Title**: [Brief description]

**Steps to Reproduce**:
1.
2.
3.

**Expected Behavior**:


**Actual Behavior**:


**Screenshots/Logs**:


**Environment**:
- Browser:
- Node Version:
- OS:
```

---

## Test Results Summary

| Test Category | Total Tests | Passed | Failed | Notes |
|---------------|-------------|--------|--------|-------|
| Authentication | 5 | | | |
| Task Management | 5 | | | |
| Notifications | 5 | | | |
| RBAC | 3 | | | |
| UI/UX | 4 | | | |
| API | 4 | | | |
| Error Handling | 4 | | | |
| Novu Integration | 4 | | | |
| Performance | 2 | | | |

---

**Testing Date**: ___________
**Tester**: ___________
**Version**: v1.0.0
**Status**: ⬜ Pass / ⬜ Fail

---

## Quick Smoke Test (2 Minutes)

If you only have 2 minutes, run this minimal test:

1. [ ] Login as admin → Verify dashboard loads
2. [ ] Login as user1 (new window) → Verify 10 tasks visible
3. [ ] Complete 1 task as user1
4. [ ] Check admin window → Verify notification received
5. [ ] **If all pass**: ✅ Core functionality working!

---

**Happy Testing! 🧪**
