"""
Run this once to seed government schemes into MongoDB.
Usage: python seed_schemes.py
"""
import asyncio
import json
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

async def seed():
    client = AsyncIOMotorClient(MONGO_URI, server_api=ServerApi('1'))
    db = client["krishirakshak"]
    collection = db["schemes"]

    # Check if already seeded
    count = await collection.count_documents({})
    if count > 0:
        print(f"✅ Schemes already seeded ({count} schemes in database). Skipping.")
        return

    # Load schemes from JSON
    json_path = os.path.join(os.path.dirname(__file__), "data/schemes.json")
    if not os.path.exists(json_path):
        json_path = os.path.join(os.path.dirname(__file__), "../data/schemes.json")
    
    with open(json_path, "r") as f:
        schemes = json.load(f)

    # Insert
    result = await collection.insert_many(schemes)
    print(f"✅ Successfully seeded {len(result.inserted_ids)} government schemes!")
    
    # Create text index for search
    await collection.create_index([("name", "text"), ("description", "text")])
    print("✅ Text search index created.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
