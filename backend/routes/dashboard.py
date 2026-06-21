from fastapi import APIRouter, Depends
from database import reports_collection, alerts_collection
from deps import get_current_user
from datetime import datetime

router = APIRouter()

def ser(doc):
    doc["_id"] = str(doc["_id"])
    for k in ["userId", "createdAt"]:
        if k in doc:
            doc[k] = str(doc[k]) if k == "userId" else doc[k].isoformat() if isinstance(doc[k], datetime) else doc[k]
    return doc

@router.get("/dashboard")
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    uid = current_user["_id"]

    total = await reports_collection.count_documents({"userId": uid})
    diseases = await reports_collection.distinct("diseaseName", {"userId": uid})
    locations = await reports_collection.distinct("latitude", {"userId": uid})
    active_alerts = await alerts_collection.count_documents({})

    recent_reports = []
    async for r in reports_collection.find({"userId": uid}).sort("createdAt", -1).limit(5):
        recent_reports.append(ser(r))

    recent_alerts = []
    async for a in alerts_collection.find({}).sort("createdAt", -1).limit(5):
        a["_id"] = str(a["_id"])
        if isinstance(a.get("createdAt"), datetime):
            a["createdAt"] = a["createdAt"].isoformat()
        recent_alerts.append(a)

    return {
        "totalReports": total,
        "activeAlerts": active_alerts,
        "detectedDiseases": len(diseases),
        "locations": len(locations),
        "recentReports": recent_reports,
        "recentAlerts": recent_alerts
    }
