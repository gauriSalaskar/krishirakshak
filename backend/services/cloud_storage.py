"""
Cloudinary image hosting service.
Free tier: 25 GB storage, 25 GB bandwidth/month — more than enough for a hackathon MVP.

Setup:
1. Sign up free at https://cloudinary.com
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Add to backend/.env:
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
"""
import cloudinary
import cloudinary.uploader
import os
from io import BytesIO

_configured = False

def _configure():
    global _configured
    if _configured:
        return
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True
    )
    _configured = True

def is_configured() -> bool:
    return bool(
        os.getenv("CLOUDINARY_CLOUD_NAME")
        and os.getenv("CLOUDINARY_API_KEY")
        and os.getenv("CLOUDINARY_API_SECRET")
    )

async def upload_image(file_bytes: bytes, folder: str = "krishirakshak") -> str:
    """
    Uploads image bytes to Cloudinary and returns the secure HTTPS URL.
    Falls back to raising an exception if Cloudinary is not configured
    so the caller can decide on a local-disk fallback.
    """
    if not is_configured():
        raise RuntimeError("Cloudinary is not configured. Add CLOUDINARY_* keys to .env")

    _configure()
    result = cloudinary.uploader.upload(
        BytesIO(file_bytes),
        folder=folder,
        resource_type="image",
        transformation=[{"width": 1200, "height": 1200, "crop": "limit", "quality": "auto:good"}]
    )
    return result["secure_url"]

async def delete_image(public_id: str):
    _configure()
    cloudinary.uploader.destroy(public_id)
