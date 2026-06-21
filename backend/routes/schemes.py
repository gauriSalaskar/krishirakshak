from fastapi import APIRouter, Depends, Query, HTTPException
from database import schemes_collection, saved_schemes_collection
from deps import get_current_user
from datetime import datetime
from bson import ObjectId
import os, httpx

router = APIRouter()

def ser(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/schemes")
async def get_schemes(
    category: str = Query(None),
    state: str = Query(None),
    search: str = Query(None),
    current_user: dict = Depends(get_current_user)
):
    query = {}
    if category and category != "All":
        query["category"] = category
    if state and state != "All States":
        query["$or"] = [{"state": state}, {"state": "All India"}]
    if search:
        query["$text"] = {"$search": search}
    
    cursor = schemes_collection.find(query).sort("name", 1)
    return [ser(s) async for s in cursor]

@router.get("/schemes/saved")
async def get_saved_schemes(current_user: dict = Depends(get_current_user)):
    cursor = saved_schemes_collection.find({"userId": current_user["_id"]})
    results = []
    async for s in cursor:
        s["_id"] = str(s["_id"])
        if isinstance(s.get("savedAt"), datetime): s["savedAt"] = s["savedAt"].isoformat()
        results.append(s)
    return results

@router.post("/schemes/save")
async def save_scheme(body: dict, current_user: dict = Depends(get_current_user)):
    scheme_id = body.get("schemeId")
    scheme = await schemes_collection.find_one({"_id": ObjectId(scheme_id)})
    if not scheme:
        raise HTTPException(404, "Scheme not found")
    
    existing = await saved_schemes_collection.find_one({"userId": current_user["_id"], "schemeId": scheme_id})
    if not existing:
        await saved_schemes_collection.insert_one({
            "userId": current_user["_id"],
            "schemeId": scheme_id,
            "schemeName": scheme["name"],
            "savedAt": datetime.utcnow()
        })
    return {"success": True}

@router.post("/schemes/eligibility")
async def check_eligibility(body: dict, current_user: dict = Depends(get_current_user)):
    land_size = body.get("landSize", 0)
    state = body.get("state", "")
    crop_type = body.get("cropType", "")
    income = body.get("income", 0)
    
    query = {"$or": [{"state": state}, {"state": "All India"}]}
    cursor = schemes_collection.find(query)
    matching = []
    async for scheme in cursor:
        scheme["_id"] = str(scheme["_id"])
        matching.append(scheme)
    return matching

@router.post("/schemes/ask")
async def ask_ai(body: dict, current_user: dict = Depends(get_current_user)):
    question = body.get("question", "")
    history = body.get("history", [])
    lang = body.get("lang", "en")

    lang_names = {"en": "English", "hi": "Hindi (हिंदी)", "mr": "Marathi (मराठी)"}
    lang_instruction = lang_names.get(lang, "English")

    # Fetch top schemes for context
    schemes_ctx = []
    async for s in schemes_collection.find({}).limit(15):
        schemes_ctx.append(f"- {s['name']}: {s['description'][:100]}. Benefits: {', '.join(s.get('benefits', [])[:2])}")
    
    schemes_text = "\n".join(schemes_ctx)
    
    system_prompt = f"""You are a helpful AI assistant for Indian farmers on the KrishiRakshak AI platform. 
You help farmers find relevant government agricultural schemes. 
Here are the available schemes in our database:
{schemes_text}

IMPORTANT: Respond in {lang_instruction}, regardless of what language the farmer writes in. If responding in Hindi or Marathi, use the native script (not transliteration).

Answer in simple, friendly language. Recommend specific schemes based on the farmer's situation. 
If they mention their land size, state, crop type, or income, suggest the most relevant schemes.
Keep answers concise and practical."""

    # Try Anthropic API first
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    if anthropic_key:
        try:
            messages = [{"role": m["role"], "content": m["content"]} for m in history if m["role"] != "system"]
            messages.append({"role": "user", "content": question})
            
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={"x-api-key": anthropic_key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
                    json={"model": "claude-haiku-4-5-20251001", "max_tokens": 500, "system": system_prompt, "messages": messages},
                    timeout=30
                )
                data = res.json()
                reply = data["content"][0]["text"]
                return {"reply": reply}
        except Exception:
            pass
    
    # Try Gemini fallback
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={gemini_key}",
                    json={"contents": [{"parts": [{"text": f"{system_prompt}\n\nFarmer: {question}"}]}]},
                    timeout=30
                )
                data = res.json()
                reply = data["candidates"][0]["content"]["parts"][0]["text"]
                return {"reply": reply}
        except Exception:
            pass
    
    return {"reply": "I'm having trouble connecting to the AI service. Please check your API keys in the .env file. In the meantime, you can browse schemes manually using the filters above!"}

@router.get("/schemes/{scheme_id}")
async def get_scheme(scheme_id: str, current_user: dict = Depends(get_current_user)):
    scheme = await schemes_collection.find_one({"_id": ObjectId(scheme_id)})
    if not scheme:
        raise HTTPException(404, "Scheme not found")
    return ser(scheme)