"""
Weather caching service — avoids hitting Open-Meteo on every single request.
Caches by rounded lat/lon (to ~1km precision) for 30 minutes.
"""
from datetime import datetime, timedelta
from database import weather_collection
import httpx

CACHE_TTL_MINUTES = 30

def _round_coord(val: float) -> float:
    return round(val, 2)  # ~1.1km precision — good enough for weather

async def get_weather(lat: float, lon: float) -> dict:
    rlat, rlon = _round_coord(lat), _round_coord(lon)
    cache_key = f"{rlat}_{rlon}"

    cached = await weather_collection.find_one({"cacheKey": cache_key})
    if cached and cached["fetchedAt"] > datetime.utcnow() - timedelta(minutes=CACHE_TTL_MINUTES):
        return cached["data"]

    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": lat, "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
            },
            timeout=10
        )
        data = res.json()

    current = data.get("current", {})
    weather_data = {
        "temperature": current.get("temperature_2m", 28),
        "humidity": current.get("relative_humidity_2m", 60),
        "windSpeed": current.get("wind_speed_10m", 10),
        "condition": "Clear"
    }

    await weather_collection.update_one(
        {"cacheKey": cache_key},
        {"$set": {"cacheKey": cache_key, "data": weather_data, "fetchedAt": datetime.utcnow(), "lat": lat, "lon": lon}},
        upsert=True
    )

    return weather_data
