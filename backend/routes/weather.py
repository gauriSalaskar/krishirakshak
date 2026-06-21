from fastapi import APIRouter, Depends, Query
from deps import get_current_user
from services.weather import get_weather

router = APIRouter()

@router.get("/weather")
async def weather_endpoint(
    lat: float = Query(...),
    lon: float = Query(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Returns current weather for a location, cached in MongoDB for 30 minutes
    to avoid hammering Open-Meteo on every report submission.
    """
    data = await get_weather(lat, lon)
    return data
