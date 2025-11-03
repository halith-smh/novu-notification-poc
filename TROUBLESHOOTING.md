# Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Notifications Not Working

#### Issue: Admin not receiving notifications when tasks are completed

**Possible Causes & Solutions:**

1. **Workflow Identifier Mismatch**
   ```
   ❌ Problem: Workflow ID in Novu doesn't match code
   ✅ Solution:
   - Open Novu Dashboard → Workflows
   - Check workflow identifier is EXACTLY: task-completed
   - Edit workflow if needed
   - Make sure it's published/active
   ```

2. **Missing In-App Step**
   ```
   ❌ Problem: Workflow has no In-App notification step
   ✅ Solution:
   - Open the workflow
   - Add In-App step if missing
   - Configure template content: {{message}}
   - Save and publish
   ```

3. **Invalid Novu API Key**
   ```
   ❌ Problem: Wrong API key in server/.env
   ✅ Solution:
   - Open Novu Dashboard → Settings → API Keys
   - Copy the API Key
   - Update NOVU_API_KEY in server/.env
   - Restart server: Ctrl+C, then npm start
   ```

4. **Invalid Application Identifier**
   ```
   ❌ Problem: Wrong App ID in client/.env
   ✅ Solution:
   - Open Novu Dashboard → Settings → API Keys
   - Copy Application Identifier
   - Update REACT_APP_NOVU_APP_ID in client/.env
   - Restart client: Ctrl+C, then npm start
   ```

5. **Subscriber Not Created**
   ```
   ❌ Problem: Admin subscriber doesn't exist in Novu
   ✅ Solution:
   - Login as admin in the app
   - Check server console for: "Subscriber created/updated"
   - If error, check NOVU_API_KEY is correct
   - Verify in Novu Dashboard → Subscribers
   ```

6. **Wrong Backend URL**
   ```
   ❌ Problem: Pointing to wrong Novu instance
   ✅ Solution:
   - Check server/.env: NOVU_BACKEND_URL=http://localhost:3000
   - Verify Novu API is accessible: curl http://localhost:3000
   - Check Docker containers are running: docker ps
   ```

**Debug Steps:**
```bash
# 1. Check server logs when completing task
# Should see:
"Notification sent to admin for task completion: Task X"

# 2. Check Novu Dashboard → Activity Feed
# Should see triggered events

# 3. Check browser console (admin)
# Should see WebSocket connection established

# 4. Test API directly
curl -X POST http://localhost:5000/api/tasks/user-001-task-1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

---

### 🔴 Server Won't Start

#### Issue: `npm start` fails in server directory

**Error 1: Port already in use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Option A: Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9

# Option B: Change port in server/.env
PORT=5001
```

**Error 2: Module not found**
```
Error: Cannot find module '@novu/node'
```
**Solution:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

**Error 3: Syntax Error**
```
SyntaxError: Cannot use import statement outside a module
```
**Solution:**
- Check server/package.json has: `"type": "module"`
- If missing, add it to package.json

**Error 4: Environment variables not loaded**
```
TypeError: Cannot read property 'NOVU_API_KEY' of undefined
```
**Solution:**
```bash
# Ensure .env file exists
cd server
ls .env  # Should exist

# Verify dotenv is imported in server.js
# Should have: import dotenv from 'dotenv'; dotenv.config();
```

---

### 🔴 Client Won't Start

#### Issue: `npm start` fails in client directory

**Error 1: Port 3000 already in use**
```
Port 3000 is already in use
```
**Solution:**
```bash
# Option A: Kill process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option B: Use different port
PORT=3001 npm start
```

**Error 2: Module not found**
```
Module not found: Can't resolve '@novu/notification-center'
```
**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

**Error 3: React Scripts not found**
```
'react-scripts' is not recognized
```
**Solution:**
```bash
cd client
npm install react-scripts --save
```

---

### 🔴 Login Issues

#### Issue: Cannot login with correct credentials

**Problem 1: 401 Unauthorized**
```
✅ Solution:
- Verify server is running (http://localhost:5000)
- Check credentials match MOCK_USERS in server.js
- Open browser DevTools → Network tab
- Check if request reaches server
```

**Problem 2: CORS Error**
```
Access to XMLHttpRequest has been blocked by CORS policy
```
```
✅ Solution:
- Verify server has cors() middleware
- Check server console for CORS errors
- Ensure REACT_APP_API_URL is correct in client/.env
```

**Problem 3: Network Error**
```
Network Error / ERR_CONNECTION_REFUSED
```
```
✅ Solution:
- Verify server is running on port 5000
- Check server logs for errors
- Test API manually: curl http://localhost:5000/api/health
```

---

### 🔴 Task Update Issues

#### Issue: Task status doesn't update

**Problem 1: 403 Forbidden**
```
✅ Solution:
- Ensure you're logged in as a guest user (not admin)
- Verify task belongs to current user
- Check JWT token is valid (not expired)
```

**Problem 2: 401 Unauthorized**
```
✅ Solution:
- Check localStorage has valid token
- Re-login if token expired
- Check Authorization header in DevTools
```

**Problem 3: UI not updating**
```
✅ Solution:
- Check browser console for errors
- Verify API call succeeds (Network tab)
- Try refreshing the page
- Check React state is updating correctly
```

---

### 🔴 UI/Display Issues

#### Issue: Notification bell not visible

**Problem:** Bell shows but is disabled/grayed out
```
✅ Solution:
- Check client/.env has REACT_APP_NOVU_APP_ID
- Ensure App ID is not the placeholder value
- Restart React dev server after changing .env
```

**Problem:** Bell shows but no badge
```
✅ Solution:
- Check WebSocket connection in browser console
- Verify socketUrl in Dashboard.js: ws://localhost:3002
- Check Novu WebSocket service is running (Docker)
```

---

### 🔴 Docker/Novu Issues

#### Issue: Novu not accessible

**Problem 1: Docker containers not running**
```bash
# Check container status
docker ps

# Should see containers like:
# - novu-api
# - novu-web
# - novu-ws
# - redis
# - mongodb

# If not running:
cd novu/docker/community
docker-compose up -d
```

**Problem 2: Port conflicts**
```
Error: port is already allocated
```
```
✅ Solution:
# Stop conflicting services or change ports in docker-compose.yml
# Default ports:
# - 3000: API
# - 3002: WebSocket
# - 4200: Dashboard
# - 6379: Redis
# - 27017: MongoDB
```

**Problem 3: Database issues**
```
✅ Solution:
# Reset Novu data
cd novu/docker/community
docker-compose down -v  # Removes volumes
docker-compose up -d    # Fresh start
```

---

### 🔴 Browser Console Errors

#### Error: "Invariant Violation"
```javascript
Invariant Violation: [React Error]
```
**Solution:** Check React version compatibility, ensure all deps updated

#### Error: "Failed to fetch"
```javascript
TypeError: Failed to fetch
```
**Solution:**
- Server not running → Start server
- Wrong URL → Check REACT_APP_API_URL
- CORS → Verify server CORS config

#### Error: "Cannot read property 'map' of undefined"
```javascript
TypeError: Cannot read property 'map' of undefined
```
**Solution:**
- API didn't return expected data structure
- Add null checks in component
- Verify API response format

---

## Verification Commands

### Check Everything is Running
```bash
# 1. Check Novu containers
docker ps | grep novu

# 2. Check Novu API
curl http://localhost:3000

# 3. Check Express server
curl http://localhost:5000/api/health

# 4. Check React app
# Open http://localhost:3000 in browser
```

### Check Configuration
```bash
# Server config
cd server
cat .env | grep -v "^#"

# Client config
cd client
cat .env | grep -v "^#"
```

### Check Logs
```bash
# Docker logs
docker logs novu-api
docker logs novu-ws

# Server logs
# Check terminal where npm start is running

# Client logs
# Check browser console (F12)
```

---

## Reset Everything (Nuclear Option)

If nothing works, reset everything:

```bash
# 1. Stop all services
cd server
# Press Ctrl+C

cd ../client
# Press Ctrl+C

# 2. Reset Novu
cd ../../novu/docker/community
docker-compose down -v
docker-compose up -d

# 3. Clean install server
cd ../../../poc\ 031125\ v3/server
rm -rf node_modules package-lock.json
npm install

# 4. Clean install client
cd ../client
rm -rf node_modules package-lock.json
npm install

# 5. Clear browser data
# In browser: F12 → Application → Clear storage → Clear all

# 6. Start fresh
cd ../server
npm start

# New terminal
cd ../client
npm start

# 7. Reconfigure Novu
# - Go to http://localhost:4200
# - Create workflow: task-completed
# - Get API keys
# - Update .env files
```

---

## Getting Help

### Debug Checklist
- [ ] All Docker containers running?
- [ ] Server started without errors?
- [ ] Client started without errors?
- [ ] Browser console shows no errors?
- [ ] Network tab shows successful API calls?
- [ ] .env files have correct values?
- [ ] Novu workflow exists and is active?

### Log Files to Check
1. **Server Terminal**: Shows API requests, Novu triggers
2. **Client Terminal**: Shows React compilation, warnings
3. **Browser Console (F12)**: Shows JS errors, network calls
4. **Novu Activity Feed**: Shows triggered workflows
5. **Docker Logs**: Shows Novu backend errors

### Useful Debug Code

**Check LocalStorage**:
```javascript
// In browser console:
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

**Check API Response**:
```javascript
// In browser console:
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log);
```

**Check Novu Connection**:
```javascript
// In Dashboard.js, add:
console.log('Novu Config:', {
  subscriberId: user.subscriberId,
  appId: process.env.REACT_APP_NOVU_APP_ID,
  backendUrl: 'http://localhost:3000'
});
```

---

## Still Having Issues?

1. **Check README.md** for setup instructions
2. **Check ARCHITECTURE.md** for system design
3. **Check TEST_CHECKLIST.md** for verification steps
4. **Check server logs** for error messages
5. **Check browser console** for client errors
6. **Re-read SETUP_GUIDE.md** step by step

---

**Last Resort**: Delete everything and start over from Step 1 of SETUP_GUIDE.md

Good luck! 🍀
