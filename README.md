# 🌱 KrishiRakshak AI

**AI-Powered Crop Disease Detection, Disease Surveillance & Outbreak Prediction Platform**

Built for National-Level Hackathon

---

## 📋 Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup Guide](#setup-guide)
5. [AI Model Training](#ai-model-training)
6. [Deployment](#deployment)
7. [API Documentation](#api-documentation)

---

## ✨ Features

- 🔬 **AI Disease Detection** — EfficientNetB0 trained on PlantVillage dataset
- 🗺️ **Live Disease Heatmap** — Leaflet + 3D Globe (react-globe.gl)
- 🚨 **Outbreak Alerts** — Auto-detection when 10+ reports in 5km/7 days
- 🌤️ **Weather Risk** — Open-Meteo integration
- 👥 **Farmer Community** — Posts, likes, comments
- 📋 **Kisan Yojana Hub** — 15+ real government schemes + AI assistant
- 🎯 **Custom Cursor** — Premium cursor animations
- 🌿 **3D UI** — Aurora gradients, tilt cards, particle effects

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS + Framer Motion |
| 3D | @react-three/fiber + react-globe.gl |
| Backend | FastAPI (Python) |
| Database | MongoDB Atlas |
| Auth | JWT |
| AI Model | TensorFlow + EfficientNetB0 |
| Maps | Leaflet + OpenStreetMap |
| Weather | Open-Meteo API |
| AI Chat | Anthropic Claude / Google Gemini |
| Deploy | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
krishirakshak/
├── frontend/               # React app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── cursor/     # Custom cursor animations
│   │   │   ├── layout/     # Sidebar, Navbar, AppLayout
│   │   ├── pages/          # All 9 pages
│   │   ├── lib/            # API client, Zustand store
│   │   └── types/          # TypeScript types
├── backend/                # FastAPI server
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic (outbreak detection)
│   ├── main.py             # FastAPI app entry
│   ├── database.py         # MongoDB connection
│   ├── deps.py             # JWT auth middleware
│   ├── seed_schemes.py     # Seed government schemes
│   └── requirements.txt
├── ai/                     # AI model files
│   ├── train_model.py      # Training script (run in Colab)
│   ├── predict.py          # Inference script
│   └── model.keras         # (Add after training)
├── data/
│   └── schemes.json        # 15+ government schemes data
└── README.md
```

---

## 🚀 Setup Guide

### Step 1 — Clone and install

```bash
# Frontend
cd frontend
npm install
cp .env.example .env
# Edit .env: set VITE_API_URL

# Backend
cd ../backend
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env: add MONGO_URI, SECRET_KEY, API keys
```

### Step 2 — MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free account
2. Create a free M0 cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Paste into `backend/.env` as `MONGO_URI`
6. Whitelist IP: Network Access → Add IP → 0.0.0.0/0 (for deployment)

### Step 3 — Seed government schemes

```bash
cd backend
python seed_schemes.py
```

### Step 4 — Add API Keys

In `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx    # Get from console.anthropic.com
# OR
GEMINI_API_KEY=AIzaSyxxxxx        # Get from aistudio.google.com
```

### Step 4.5 — Cloudinary Image Hosting (Important!)

⚠️ **Without this, uploaded images disappear when Render restarts your backend** (free tier wipes local disk).

1. Sign up free at [cloudinary.com](https://cloudinary.com) (25GB free storage)
2. Go to Dashboard → copy **Cloud Name**, **API Key**, **API Secret**
3. Add to `backend/.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

If these are missing, the app still works — it falls back to local disk storage automatically (fine for local development, not for production).

### Step 5 — Train AI Model (see section below)

### Step 6 — Run

```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open: http://localhost:5173

---

## 🤖 AI Model Training

### Using Google Colab (Recommended — Free GPU)

1. Go to [colab.research.google.com](https://colab.research.google.com)
2. Create new notebook
3. Enable GPU: Runtime → Change runtime type → GPU
4. Run these cells:

```python
# Cell 1: Install dependencies
!pip install tensorflow kaggle

# Cell 2: Download PlantVillage dataset
!kaggle datasets download -d emmarex/plantdisease
!unzip plantdisease.zip -d ./PlantVillage

# Cell 3: Upload and run training script
# (Upload train_model.py from ai/ folder)
!python train_model.py

# Cell 4: Download trained model
from google.colab import files
files.download('model.keras')
files.download('class_names.json')
```

5. Copy `model.keras` to your `ai/` folder
6. Restart your backend server

**Training time:** ~1-2 hours on Colab free GPU

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Push to GitHub, then connect repo to vercel.com
# Set environment variable: VITE_API_URL=https://your-backend.onrender.com
```

### Backend → Render

1. Push backend folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Settings:
   - **Build Command:** `pip install -r requirements.txt && python seed_schemes.py`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env`

---

## 🔧 Recent Fixes (v1.1)

- ✅ **Cloudinary image hosting** — images now persist on Render's free tier instead of disappearing on restart (falls back to local disk if Cloudinary isn't configured)
- ✅ **Eligibility Checker** — full modal UI wired to `/schemes/eligibility` (was backend-only before)
- ✅ **Weather caching** — `/weather` endpoint caches Open-Meteo responses in MongoDB for 30 minutes instead of hitting the API on every report
- ✅ **Client-side image compression** — photos resized to max 1600px and re-encoded as JPEG before upload
- ✅ **Real Hindi/Marathi translation** — Kisan Yojana Hub UI strings genuinely translate; AI assistant replies in selected language
- ✅ **WhatsApp share + Print** — added to each scheme's expanded detail view
- ✅ **Saved schemes persist on reload** — bookmark state loads from `/schemes/saved` on mount
- ✅ **Magnetic tilt cards** — extended to Alerts and Community pages
- ✅ **Basic rate limiting** — 100 requests/minute per IP, in-memory

---

## 📡 API Documentation

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, get JWT token |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reports` | Submit disease report |
| GET | `/reports` | Get user's reports |
| GET | `/heatmap` | Get all reports for map |

### Predict
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Upload image, get disease prediction |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/alerts` | Get all outbreak alerts |

### Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/community` | Get all posts |
| POST | `/community` | Create new post |
| POST | `/community/{id}/like` | Like a post |
| POST | `/community/{id}/comment` | Add comment |

### Schemes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/schemes` | Get schemes (with filters) |
| GET | `/schemes/{id}` | Get scheme details |
| POST | `/schemes/save` | Save scheme |
| GET | `/schemes/saved` | Get saved schemes |
| POST | `/schemes/eligibility` | Check eligibility |
| POST | `/schemes/ask` | AI assistant |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Dashboard stats |
| GET | `/profile` | User profile + history |
| GET | `/weather` | Cached weather lookup (lat, lon query params) |

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `SECRET_KEY` | ✅ | JWT signing secret |
| `BASE_URL` | ✅ | Backend URL for image hosting fallback |
| `ANTHROPIC_API_KEY` | Optional | For Kisan Yojana AI chat |
| `GEMINI_API_KEY` | Optional | Fallback for AI chat |
| `CLOUDINARY_CLOUD_NAME` | Recommended | Image hosting — falls back to local disk if absent |
| `CLOUDINARY_API_KEY` | Recommended | Image hosting |
| `CLOUDINARY_API_SECRET` | Recommended | Image hosting |

---

## 📞 Support

Built for National Hackathon 2025.
Platform: KrishiRakshak AI — Protecting Indian farmers with AI.

---

© 2025 KrishiRakshak AI
