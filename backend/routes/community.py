from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from database import community_collection
from deps import get_current_user
from datetime import datetime
from bson import ObjectId
import os
from services.cloud_storage import upload_image, is_configured

router = APIRouter()

def ser(doc):
    doc["_id"] = str(doc["_id"])
    if isinstance(doc.get("createdAt"), datetime):
        doc["createdAt"] = doc["createdAt"].isoformat()
    if "userId" in doc:
        doc["userId"] = str(doc["userId"])
    return doc

async def save_image(file: UploadFile, contents: bytes) -> str:
    if is_configured():
        try:
            return await upload_image(contents, folder="krishirakshak/community")
        except Exception as e:
            print(f"⚠️ Cloudinary upload failed, falling back to local disk: {e}")

    os.makedirs("uploads", exist_ok=True)
    import uuid
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    fname = f"{uuid.uuid4()}.{ext}"
    path = f"uploads/{fname}"
    with open(path, "wb") as f:
        f.write(contents)
    base_url = os.getenv("BASE_URL", "http://localhost:8000")
    return f"{base_url}/uploads/{fname}"

@router.get("/community")
async def get_posts(current_user: dict = Depends(get_current_user)):
    cursor = community_collection.find({}).sort("createdAt", -1).limit(50)
    return [ser(p) async for p in cursor]

@router.post("/community")
async def create_post(
    content: str = Form(...),
    diseaseTag: str = Form(None),
    file: UploadFile = File(None),
    current_user: dict = Depends(get_current_user)
):
    image_url = None
    if file:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(400, "File must be an image")
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(400, "Image must be under 10MB")
        image_url = await save_image(file, contents)

    doc = {
        "userId": current_user["_id"],
        "userName": current_user["name"],
        "content": content,
        "imageUrl": image_url,
        "diseaseTag": diseaseTag,
        "location": "India",
        "likes": 0,
        "likedBy": [],
        "comments": [],
        "createdAt": datetime.utcnow()
    }
    result = await community_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return ser(doc)

@router.post("/community/{post_id}/like")
async def like_post(post_id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    post = await community_collection.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(404, "Post not found")

    already_liked = user_id in post.get("likedBy", [])

    if already_liked:
        await community_collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$pull": {"likedBy": user_id}, "$inc": {"likes": -1}}
        )
        return {"success": True, "liked": False}
    else:
        await community_collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$addToSet": {"likedBy": user_id}, "$inc": {"likes": 1}}
        )
        return {"success": True, "liked": True}

@router.post("/community/{post_id}/comment")
async def add_comment(post_id: str, body: dict, current_user: dict = Depends(get_current_user)):
    comment = {
        "userId": str(current_user["_id"]),
        "userName": current_user["name"],
        "content": body.get("content", ""),
        "createdAt": datetime.utcnow().isoformat()
    }
    await community_collection.update_one({"_id": ObjectId(post_id)}, {"$push": {"comments": comment}})
    return {"success": True}