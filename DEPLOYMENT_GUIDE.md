# 🚀 Deployment Guide - Make YatraGenie Live

This guide provides multiple options to get your web app running, from local testing to cloud deployment.

## ⚡ Quick Start Options

### Option 1: Local Development (Fastest for Testing)

**Requirements:**
- Python 3.8+ (you have 3.6 - need to upgrade)
- Node.js 18+

**Steps:**

1. **Upgrade Python** (if needed):
   - Download Python 3.9+ from https://www.python.org/downloads/
   - Install and add to PATH
   - Verify: `python --version` should show 3.8+

2. **Install Node.js**:
   - Download from https://nodejs.org/ (LTS version)
   - Install and verify: `node --version`

3. **Run Backend:**
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   uvicorn backend.main:app --reload --port 8000 --host 0.0.0.0
   ```

4. **Run Frontend** (new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

---

### Option 2: Deploy to Cloud (Free Options)

#### A. Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repo
4. Set root directory to `frontend`
5. Add environment variable: `NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com`
6. Deploy!

**Backend on Railway:**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Set root directory to `backend`
5. Add start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
6. Railway auto-detects Python and installs dependencies

**Backend on Render:**
1. Go to https://render.com
2. New Web Service
3. Connect GitHub repo
4. Settings:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - Root Directory: `backend`

#### B. Replit (All-in-One - Easiest!)

Replit can run both frontend and backend together:

1. Go to https://replit.com
2. Create new Repl → Import from GitHub
3. Use the `.replit` configuration (if exists)
4. Replit will auto-detect and run both servers
5. Share the public URL

---

### Option 3: Docker Deployment (Advanced)

I'll create Docker files for easy deployment anywhere.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are set
- [ ] CORS is configured for your frontend URL
- [ ] Data files are included in deployment
- [ ] No hardcoded localhost URLs
- [ ] Build commands are correct

---

## 🔧 Configuration Files Created

I've created all necessary config files:
- ✅ `Dockerfile.backend` - Backend container
- ✅ `Dockerfile.frontend` - Frontend container  
- ✅ `docker-compose.yml` - Run both with one command
- ✅ `start_local.bat` - Windows startup script
- ✅ `start_local.sh` - Mac/Linux startup script
- ✅ `.replit` - Replit configuration
- ✅ `railway.json` - Railway deployment config
- ✅ `vercel.json` - Vercel deployment config

---

## 🎯 Recommended: Start Here

**For fastest setup, see `QUICK_START.md`** - it has the simplest instructions!

---

## 📝 Detailed Deployment Steps

### Local Development (Recommended First)

1. **Install Prerequisites:**
   - Python 3.8+: https://www.python.org/downloads/
   - Node.js 18+: https://nodejs.org/

2. **Quick Start:**
   ```bash
   # Windows
   start_local.bat
   
   # Mac/Linux
   chmod +x start_local.sh && ./start_local.sh
   ```

3. **Manual Start (if script doesn't work):**
   
   **Terminal 1:**
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # Mac/Linux
   pip install -r requirements.txt
   uvicorn backend.main:app --reload --port 8000 --host 0.0.0.0
   ```
   
   **Terminal 2:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

---

### Cloud Deployment Options

#### Option A: Replit (Easiest - No Local Setup)

1. Go to https://replit.com
2. Sign up (free)
3. Click "Create Repl" → "Import from GitHub"
4. Enter your GitHub repo URL
5. Click "Run"
6. Your app is live! Share the URL

**Pros:**
- ✅ No local installation needed
- ✅ Free tier available
- ✅ Auto-runs both servers
- ✅ Public URL instantly

**Cons:**
- ⚠️ Free tier has limitations
- ⚠️ Slower than local

---

#### Option B: Vercel (Frontend) + Railway (Backend)

**Step 1: Deploy Backend to Railway**

1. Push code to GitHub
2. Go to https://railway.app
3. Sign up with GitHub
4. Click "New Project" → "Deploy from GitHub repo"
5. Select your repository
6. Railway auto-detects Python
7. Set these in Settings:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
8. Railway provides a URL like: `https://your-app.railway.app`

**Step 2: Deploy Frontend to Vercel**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project" → Import your GitHub repo
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Environment Variable**: 
     - Key: `NEXT_PUBLIC_API_BASE_URL`
     - Value: Your Railway backend URL (e.g., `https://your-app.railway.app`)
5. Click "Deploy"
6. Vercel provides a URL like: `https://your-app.vercel.app`

**Result:**
- ✅ Frontend: https://your-app.vercel.app
- ✅ Backend: https://your-app.railway.app
- ✅ Both free tiers available

---

#### Option C: Docker Deployment

**Local with Docker:**
```bash
docker-compose up
```

**Deploy to any Docker host:**
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

All support Docker Compose or individual containers.

---

## 🔐 Environment Variables

### Backend (.env in backend/)
```env
OPENAI_API_KEY=your_key_here  # Optional, for LLM features
TRAVEL_DATA_DIR=./data         # Default, usually don't need to change
```

### Frontend (.env.local in frontend/)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # Local
# Or for production:
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible (test `/api/health`)
- [ ] Frontend loads without errors
- [ ] API calls work (check browser console)
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Data files are included in deployment

---

## 🐛 Common Issues

### Backend won't start
- Check Python version: `python --version` (need 3.8+)
- Check port 8000 is available
- Check dependencies: `pip list | grep fastapi`

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check CORS settings in `backend/main.py`
- Verify backend is running and accessible

### Data not loading
- Ensure `data/` directory is included in deployment
- Check file paths are relative, not absolute
- Verify JSON files are valid

---

## 📊 Deployment Comparison

| Option | Difficulty | Cost | Setup Time | Best For |
|--------|-----------|------|------------|----------|
| Local | Easy | Free | 5 min | Testing |
| Replit | Very Easy | Free | 2 min | Quick demo |
| Vercel+Railway | Medium | Free | 15 min | Production |
| Docker | Medium | Varies | 10 min | Enterprise |

---

## 🎉 Success!

Once deployed, you can:
- ✅ Share the URL with others
- ✅ Test on mobile devices
- ✅ Show to investors
- ✅ Continue development

**Need help?** Check `QUICK_START.md` for the simplest path!

