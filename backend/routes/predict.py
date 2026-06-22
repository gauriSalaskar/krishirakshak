from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from deps import get_current_user

router = APIRouter()

@router.post("/predict")
async def predict_disease(
    file: UploadFile = File(...),
    cropName: str = Form(None),
    current_user: dict = Depends(get_current_user)
):
    try:
        from ai.predict import predict_image, NotPlantError
        contents = await file.read()
        result = predict_image(contents, crop_filter=cropName)
        return result
    except ImportError as e:
        raise HTTPException(
            status_code=503,
            detail=f"AI model unavailable: {str(e)}"
        )
    except NotPlantError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")