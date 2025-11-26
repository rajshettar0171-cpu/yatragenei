# 🚀 Deployment Checklist

This checklist ensures your YatraGenie app is ready for production deployment.

## ✅ Pre-Deployment Checks

### Backend (FastAPI)

- [x] **Fixed missing `List` import** in `backend/main.py`
- [x] **Error handling** added to health endpoint
- [x] **Data path resolution** works in production (relative paths from backend/)
- [x] **CORS** configured to allow all origins (for Vercel frontend)
- [x] **Environment variables** support via `TRAVEL_DATA_DIR` (optional)
- [x] **Health endpoint** has try-catch for deployment monitoring

### Frontend (Next.js)

- [x] **Error handling** added to all API fetch calls
- [x] **Error UI** displays user-friendly messages
- [x] **ChatModal title** updated to be generic (not Shimla-specific)
- [x] **Environment variable** `NEXT_PUBLIC_API_BASE_URL` properly used
- [x] **Fallback** to localhost only in development
- [x] **Response validation** checks `response.ok` before parsing JSON

### Data Files

- [x] **Data directory** structure maintained (`data/` at project root)
- [x] **JSON files** use UTF-8 encoding
- [x] **File paths** are relative and work in production

## 🔧 Deployment Steps

### 1. Backend Deployment (Railway/Render)

**Required:**
- Python 3.8+
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

**Environment Variables (Optional):**
- `TRAVEL_DATA_DIR` - Only if data is in a custom location
- `OPENAI_API_KEY` - Only if using LLM features

**Verify:**
- Health check: `https://your-backend-url/api/health`
- Should return: `{"status": "ok", ...}`

### 2. Frontend Deployment (Vercel)

**Required:**
- Root directory: `frontend`
- Framework: Next.js (auto-detected)
- Build command: `npm run build` (default)

**Critical Environment Variable:**
- `NEXT_PUBLIC_API_BASE_URL` = Your backend URL (e.g., `https://your-app.up.railway.app`)

**Verify:**
- App loads without errors
- Destination selector works
- Can generate itineraries
- Chat assistant responds

## 🐛 Common Issues & Fixes

### Issue: "Failed to load destinations"
**Cause:** Backend URL not set or incorrect  
**Fix:** Set `NEXT_PUBLIC_API_BASE_URL` in Vercel environment variables

### Issue: "Mock data file missing"
**Cause:** Data directory not accessible in production  
**Fix:** Ensure `data/` folder is in the repository and paths are relative

### Issue: CORS errors
**Cause:** Backend not allowing frontend origin  
**Fix:** Already configured with `allow_origins=["*"]` in `backend/main.py`

### Issue: Health check fails
**Cause:** DataStore not initialized  
**Fix:** Check that data files exist and are readable

## 📝 Post-Deployment Testing

1. **Health Check**
   ```bash
   curl https://your-backend-url/api/health
   ```

2. **Test Itinerary Generation**
   - Select a destination
   - Fill form and generate itinerary
   - Verify it loads without errors

3. **Test Chat Assistant**
   - Open chat modal
   - Ask: "Is this place crowded today?"
   - Verify response

4. **Test Admin Panel**
   - View scraped content
   - Tag a hidden gem
   - Verify success message

5. **Test Error Handling**
   - Temporarily break backend URL
   - Verify error message displays
   - Restore and verify recovery

## ✨ Production Optimizations (Future)

- [ ] Add rate limiting to API endpoints
- [ ] Implement proper logging (e.g., Python logging, Sentry)
- [ ] Add API authentication for admin endpoints
- [ ] Cache destination data in Redis
- [ ] Add monitoring/alerting (e.g., UptimeRobot)
- [ ] Implement CDN for static assets
- [ ] Add database for persistent data (replace JSON files)

