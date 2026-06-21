from fastapi import APIRouter, Depends
from database import alerts_collection
from deps import get_current_user
from datetime import datetime

router = APIRouter()

def serialize(doc):
    doc["_id"] = str(doc["_id"])
    if isinstance(doc.get("createdAt"), datetime):
        doc["createdAt"] = doc["createdAt"].isoformat()
    return doc

@router.get("/alerts")
async def get_alerts(current_user: dict = Depends(get_current_user)):
    cursor = alerts_collection.find({}).sort("createdAt", -1)
    return [serialize(a) async for a in cursor]
