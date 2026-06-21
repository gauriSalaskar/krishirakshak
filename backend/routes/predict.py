from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from deps import get_current_user
import os, sys

router = APIRouter()

@router.post("/predict")
async def predict_disease(
    file: UploadFile = File(...),
    cropName: str = Form(None),
    current_user: dict = Depends(get_current_user)
):
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../ai"))
    
    try:
        from predict import predict_image, NotPlantError
        contents = await file.read()
        result = predict_image(contents, crop_filter=cropName)
        return result
    except ImportError:
        # Model not yet trained - return helpful error
        raise HTTPException(
            status_code=503,
            detail="AI model not loaded. Please train the model first using Google Colab. See TRAINING_GUIDE.md"
        )
    except NotPlantError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")