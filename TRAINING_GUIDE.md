# 🤖 AI Model Training Guide — KrishiRakshak AI

## Overview
The AI disease detection uses EfficientNetB0 trained on the PlantVillage dataset (54,000+ images, 38 disease classes).

---

## Step-by-Step Guide (Google Colab — Free)

### Step 1 — Get Kaggle API Key
1. Go to https://kaggle.com → Sign in (create free account)
2. Click your profile picture → Settings
3. Scroll to "API" section → Click **Create New API Token**
4. A file called `kaggle.json` will download — keep it safe

### Step 2 — Open Google Colab
1. Go to https://colab.research.google.com
2. Click **File → Upload notebook**
3. Upload `Colab_Train.ipynb` from the `ai/` folder
4. **IMPORTANT**: Enable GPU → Runtime → Change runtime type → **T4 GPU** → Save

### Step 3 — Run the Cells
Run each cell in order (Shift+Enter or click ▶️):

| Cell | What it does | Time |
|------|-------------|------|
| Cell 1 | Install dependencies | 1 min |
| Cell 2 | Upload kaggle.json | 30 sec |
| Cell 3 | Download PlantVillage dataset (2.5GB) | 10-15 min |
| Cell 4 | Train EfficientNetB0 model | **60-90 min** |
| Cell 5 | Download model.keras + class_names.json | 1 min |

### Step 4 — Add Files to Project
After training completes and files download:

```
krishirakshak/
└── ai/
    ├── model.keras          ← Put here (from Colab download)
    ├── class_names.json     ← Put here (from Colab download)
    ├── predict.py           ← Already exists
    └── train_model.py       ← Already exists
```

### Step 5 — Restart Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```

The `/predict` endpoint will now work with real AI predictions!

---

## Expected Model Performance
- **Accuracy**: 92-96% on validation set
- **Classes**: 38 disease categories
- **Inference time**: <2 seconds per image
- **Model size**: ~20MB (EfficientNetB0 is lightweight)

---

## Troubleshooting

**"Kaggle dataset download fails"**
→ Make sure kaggle.json is uploaded correctly in Cell 2

**"Out of GPU memory"**
→ Reduce BATCH_SIZE from 32 to 16 in Cell 4

**"Training is very slow"**
→ Make sure GPU is enabled (Runtime → Change runtime type → T4 GPU)

**"model.keras not found when running backend"**
→ Make sure model.keras is in the `ai/` folder (not `backend/` or project root)

---

## Alternative: Use Pre-trained Model
If you don't want to train, you can find pre-trained PlantVillage models on:
- Kaggle: search "PlantVillage EfficientNet model"  
- GitHub: search "plant disease detection keras model"

Download any `.h5` or `.keras` model trained on PlantVillage and rename to `model.keras`.
