from datetime import datetime, timedelta
from database import reports_collection, alerts_collection
import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

async def check_outbreak(disease_name: str, lat: float, lon: float):
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    cursor = reports_collection.find({
        "diseaseName": disease_name,
        "createdAt": {"$gte": seven_days_ago}
    })
    
    nearby = []
    async for report in cursor:
        dist = haversine(lat, lon, report["latitude"], report["longitude"])
        if dist <= 5:
            nearby.append(report)
    
    if len(nearby) >= 10:
        existing = await alerts_collection.find_one({
            "diseaseName": disease_name,
            "createdAt": {"$gte": seven_days_ago}
        })
        if not existing:
            alert = {
                "diseaseName": disease_name,
                "affectedArea": f"Area near ({lat:.2f}, {lon:.2f})",
                "cases": len(nearby),
                "riskLevel": "High",
                "latitude": lat,
                "longitude": lon,
                "radius": 5,
                "createdAt": datetime.utcnow()
            }
            await alerts_collection.insert_one(alert)
