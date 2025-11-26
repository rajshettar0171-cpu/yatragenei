# 🚀 START HERE - Get Your App Running!

## ⚡ Fastest Way to Try It Out

### You have 3 options (pick one):

---

## Option 1: One-Click Local Start (5 minutes)

**If you have Python 3.8+ and Node.js 18+:**

### Windows:
```bash
# Just double-click this file:
start_local.bat
```

### Mac/Linux:
```bash
chmod +x start_local.sh
./start_local.sh
```

**Then open**: http://localhost:3000

---

## Option 2: Replit Cloud (2 minutes - NO INSTALLATION!)

1. Go to https://replit.com
2. Sign up (free)
3. Click "Create Repl" → "Import from GitHub"
4. Paste your GitHub repo URL
5. Click "Run"
6. **Done!** Your app is live with a public URL

**No Python or Node.js needed!**

---

## Option 3: Manual Setup (10 minutes)

### Step 1: Install Prerequisites
- **Python 3.8+**: https://www.python.org/downloads/
- **Node.js 18+**: https://nodejs.org/

### Step 2: Start Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate    # Windows
# source .venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

### Step 3: Start Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Open Browser
Go to: **http://localhost:3000**

---

## ❓ Which Option Should I Choose?

- **Want it running NOW?** → Option 2 (Replit)
- **Have Python/Node installed?** → Option 1 (One-click)
- **Want to learn the setup?** → Option 3 (Manual)

---

## ✅ Success Looks Like:

- ✅ Backend running at http://localhost:8000
- ✅ Frontend running at http://localhost:3000
- ✅ Can see destination selector
- ✅ Can generate an itinerary
- ✅ Chat assistant works

---

## 🆘 Having Issues?

1. **Check Python version**: `python --version` (need 3.8+)
2. **Check Node version**: `node --version` (need 18+)
3. **Read**: `QUICK_START.md` for detailed troubleshooting
4. **Read**: `DEPLOYMENT_GUIDE.md` for all options

---

## 📚 More Help

- **Quick Start Guide**: `QUICK_START.md`
- **Full Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Project Documentation**: `PROJECT_GUIDE.md`

---

**Ready? Pick an option above and let's go! 🚀**

