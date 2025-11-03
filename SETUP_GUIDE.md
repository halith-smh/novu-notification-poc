# Quick Setup Guide - Novu POC

## 🚀 Quick Start (5 Minutes)

### 1. Configure Novu Workflow (2 minutes)

1. Open http://localhost:4200 (Novu Dashboard)
2. Login/Signup
3. Go to **Settings → API Keys**, copy:
   - API Key
   - Application Identifier

4. Go to **Workflows → Create Workflow**:
   - Name: `Task Completed Notification`
   - Identifier: **`task-completed`** ⚠️ (MUST be exactly this)

5. Add In-App Step:
   - Click **Add Step** → **In-App**
   - Content: `{{message}}`
   - Click **Update** and **Save**

### 2. Update Environment Files (1 minute)

**Server (.env)**:
```bash
cd server
```

Edit `server/.env`:
```env
NOVU_API_KEY=paste_your_api_key_here
NOVU_BACKEND_URL=http://localhost:3000
JWT_SECRET=mock_jwt_secret_for_poc_demo_2024
PORT=5000
```

**Client (.env)**:
```bash
cd ../client
```

Edit `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NOVU_APP_ID=paste_your_application_identifier_here
```

### 3. Install & Run (2 minutes)

**Terminal 1 - Server**:
```bash
cd server
npm install
npm start
```

**Terminal 2 - Client**:
```bash
cd client
npm install
npm start
```

## 🧪 Test the Flow

### Two Browser Windows Method

**Window 1 - Admin**:
1. Go to http://localhost:3000
2. Login: `admin` / `admin123`
3. Keep this window open

**Window 2 - User**:
1. Go to http://localhost:3000 (new incognito window)
2. Login: `user1` / `user123`
3. Click any task → Click **✅ Complete**
4. See message: "Notification sent to admin!"

**Back to Window 1 - Admin**:
1. Click the notification bell 🔔
2. See the notification from user1!

## 📋 Credentials

| User   | Username | Password  | Role  |
|--------|----------|-----------|-------|
| Admin  | admin    | admin123  | Admin |
| User 1 | user1    | user123   | Guest |
| User 2 | user2    | user123   | Guest |
| User 3 | user3    | user123   | Guest |

## ✅ Verification Checklist

- [ ] Novu running at http://localhost:4200
- [ ] Novu API at http://localhost:3000
- [ ] Workflow created with ID: `task-completed`
- [ ] In-App step added to workflow
- [ ] API Key added to `server/.env`
- [ ] App ID added to `client/.env`
- [ ] Server running at http://localhost:5000
- [ ] Client running at http://localhost:3000
- [ ] Can login as admin
- [ ] Can login as user1
- [ ] Task completion sends notification
- [ ] Admin receives notification

## 🐛 Common Issues

### "Workflow not found" error
- Ensure workflow identifier is exactly: `task-completed`
- Check the workflow is published/active in Novu dashboard

### Notification bell not showing
- Check `REACT_APP_NOVU_APP_ID` in `client/.env`
- Ensure it's not set to `your_novu_application_identifier_here`

### No notifications received
- Check server console for errors
- Verify workflow has In-App step
- Check admin subscriber was created (check server logs)

### Port already in use
- Server: Change `PORT` in `server/.env`
- Client: Run `PORT=3001 npm start` instead

## 📞 Need Help?

Check the detailed [README.md](README.md) for:
- Complete API documentation
- Architecture details
- Advanced configuration
- Troubleshooting guide

---

**You're all set! 🎉**
