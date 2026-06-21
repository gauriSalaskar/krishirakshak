from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "krishirakshak"

client = AsyncIOMotorClient(MONGO_URI, server_api=ServerApi('1'))
db = client[DB_NAME]

users_collection = db["users"]
reports_collection = db["reports"]
alerts_collection = db["alerts"]
community_collection = db["community_posts"]
weather_collection = db["weather_data"]
schemes_collection = db["schemes"]
saved_schemes_collection = db["saved_schemes"]

async def create_indexes():
    await users_collection.create_index("email", unique=True)
    await reports_collection.create_index([("latitude", 1), ("longitude", 1)])
    await reports_collection.create_index("userId")
    await reports_collection.create_index("createdAt")
    await alerts_collection.create_index("createdAt")
    await schemes_collection.create_index("schemeId", unique=True)
    await schemes_collection.create_index([("name", "text"), ("description", "text")])
