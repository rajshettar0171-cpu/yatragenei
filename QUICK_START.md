# ⚡ Quick Start - Get YatraGenie Running in 5 Minutes

## 🎯 Easiest Option: Use the Startup Script

### Windows:
Double-click `start_local.bat` or run:
```bash
start_local.bat
```

### Mac/Linux:
```bash
chmod +x start_local.sh
./start_local.sh
```

**Note**: This requires Python 3.8+ and Node.js 18+ installed.

---

## 🔍 Check Your Setup First

### 1. Check Python Version
```bash
python --version
```
**Need**: Python 3.8 or higher (you have 3.6 - need to upgrade)

**Fix**: Download from https://www.python.org/downloads/

### 2. Check Node.js
```bash
node --version
```
**Need**: Node.js 18 or higher

**Fix**: Download from https://nodejs.org/ (LTS version)

---

## 🚀 If You Have Python 3.8+ and Node.js

### Option A: Use Startup Script (Easiest)
- **Windows**: Double-click `start_local.bat`
- **Mac/Linux**: Run `./start_local.sh`

### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate    # Windows
# source .venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Then open**: http://localhost:3000

---

## ☁️ Deploy to Cloud (No Local Setup Needed)

### Option 1: Replit (Easiest Cloud Option)

1. Go to https://replit.com
2. Sign up/login
3. Click "Create Repl"
4. Choose "Import from GitHub"
5. Enter your GitHub repo URL
6. Replit will auto-detect and run both servers
7. Click "Run" - your app is live!

**Pros**: No local setup, free tier, instant deployment

### Option 2: Vercel + Railway (Production Ready)

**Frontend (Vercel):**
1. Push code to GitHub
2. Go to https://vercel.com
3. Import GitHub repo
4. Set root: `frontend`
5. Add env var: `NEXT_PUBLIC_API_BASE_URL` = your backend URL
6. Deploy!

**Backend (Railway):**
1. Go to https://railway.app
2. New Project → GitHub
3. Select repo
4. Root: `backend`
5. Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
6. Deploy!

---

## 🐳 Docker Option (If You Have Docker)

```bash
docker-compose up
```

This starts both frontend and backend automatically.

---

## ❓ Troubleshooting

### "Python version too old"
- Download Python 3.9 from https://www.python.org/downloads/
- During install, check "Add Python to PATH"

### "Node.js not found"
- Download Node.js LTS from https://nodejs.org/
- Install and restart terminal

### "Port 8000 already in use"
- Change port in backend: `--port 8001`
- Update frontend `.env.local`: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8001`

### "Module not found"
- Backend: `pip install -r backend/requirements.txt`
- Frontend: `npm install` in frontend directory

---

## 📞 Need Help?

1. Check `PROJECT_GUIDE.md` for detailed documentation
2. Check `TEST_RESULTS.md` for known issues
3. Verify all files are in correct directories

---

## ✅ Success Checklist

When running, you should see:
- ✅ Backend: "Application startup complete" at http://localhost:8000
- ✅ Frontend: Next.js dev server at http://localhost:3000
- ✅ Can access http://localhost:3000 in browser
- ✅ Can see destination selector
- ✅ Can generate itinerary

---

**Ready to go?** Start with the startup script or follow manual steps above!

