from fastapi import APIRouter, Depends
from database import reports_collection, alerts_collection, saved_schemes_collection
from deps import get_current_user
from datetime import datetime

router = APIRouter()

def ser(doc):
    doc["_id"] = str(doc["_id"])
    for k in doc:
        if isinstance(doc[k], datetime):
            doc[k] = doc[k].isoformat()
    return doc

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    uid = current_user["_id"]
    reports, alerts_list, saved = [], [], []
    async for r in reports_collection.find({"userId": uid}).sort("createdAt", -1):
        r["_id"] = str(r["_id"])
        r["userId"] = str(r["userId"])
        if isinstance(r.get("createdAt"), datetime): r["createdAt"] = r["createdAt"].isoformat()
        reports.append(r)
    async for a in alerts_collection.find({}).sort("createdAt", -1).limit(20):
        a["_id"] = str(a["_id"])
        if isinstance(a.get("createdAt"), datetime): a["createdAt"] = a["createdAt"].isoformat()
        alerts_list.append(a)
    async for s in saved_schemes_collection.find({"userId": uid}):
        s["_id"] = str(s["_id"])
        s["userId"] = str(s["userId"])
        if isinstance(s.get("savedAt"), datetime): s["savedAt"] = s["savedAt"].isoformat()
        saved.append(s)
    return {
        "user": {"id": str(uid), "name": current_user["name"], "email": current_user["email"],
                 "createdAt": current_user.get("createdAt", datetime.utcnow()).isoformat()},
        "reports": reports,
        "alerts": alerts_list,
        "savedSchemes": saved
    }