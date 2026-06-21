import numpy as np
import io
import os
from PIL import Image

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.keras")
CLASS_NAMES_PATH = os.path.join(os.path.dirname(__file__), "class_names.json")

DISEASE_INFO = {
    "Apple___Apple_scab": {"display": "Apple Scab", "symptoms": ["Olive-green to brown velvety lesions on leaves", "Lesions turn dark and scabby", "Fruit develops corky scab-like lesions", "Severe cases cause early leaf drop"], "treatment": ["Apply fungicides like captan at bud break", "Remove and destroy fallen infected leaves", "Prune trees to improve air circulation", "Spray copper-based fungicide every 7-10 days"], "prevention": ["Plant scab-resistant apple varieties", "Rake and destroy fallen leaves in autumn", "Avoid overhead irrigation"], "riskLevel": "Medium"},
    "Apple___Black_rot": {"display": "Apple Black Rot", "symptoms": ["Purple spots on leaves with frog-eye appearance", "Brown to black rotting on fruit", "Cankers on branches", "Shriveled mummified fruits"], "treatment": ["Remove mummified fruits and dead wood", "Apply captan or thiophanate-methyl fungicide", "Prune infected branches below infection"], "prevention": ["Remove all mummified fruits before winter", "Maintain tree vigor", "Apply dormant copper spray"], "riskLevel": "High"},
    "Apple___Cedar_apple_rust": {"display": "Cedar Apple Rust", "symptoms": ["Bright orange-yellow spots on upper leaf surface", "Orange tube-like structures on leaf undersides", "Fruit lesions with orange powdery spores", "Premature defoliation"], "treatment": ["Apply myclobutanil or propiconazole fungicide", "Spray at pink bud stage every 7-10 days"], "prevention": ["Plant rust-resistant apple varieties", "Avoid planting near eastern red cedar"], "riskLevel": "Medium"},
    "Apple___healthy": {"display": "Healthy Apple Plant", "symptoms": ["No disease symptoms detected"], "treatment": ["No treatment required", "Continue regular monitoring"], "prevention": ["Maintain regular inspection", "Balanced fertilization"], "riskLevel": "Low"},
    "Blueberry___healthy": {"display": "Healthy Blueberry Plant", "symptoms": ["No disease symptoms detected"], "treatment": ["No treatment required"], "prevention": ["Monitor regularly", "Maintain soil pH 4.5-5.5"], "riskLevel": "Low"},
    "Cherry_(including_sour)___Powdery_mildew": {"display": "Cherry Powdery Mildew", "symptoms": ["White powdery coating on young leaves", "Leaf curling and distortion", "Stunted shoot growth", "Premature leaf drop"], "treatment": ["Apply sulfur or potassium bicarbonate spray", "Use systemic fungicides like myclobutanil", "Remove heavily infected shoots"], "prevention": ["Plant in areas with good air circulation", "Avoid excessive nitrogen fertilization"], "riskLevel": "Medium"},
    "Cherry_(including_sour)___healthy": {"display": "Healthy Cherry Plant", "symptoms": ["No disease symptoms detected"], "treatment": ["No treatment required"], "prevention": ["Regular monitoring", "Proper pruning"], "riskLevel": "Low"},
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {"display": "Corn Gray Leaf Spot", "symptoms": ["Rectangular gray to tan lesions on leaves", "Lesions run parallel to leaf veins", "Lesions may merge causing blight", "Premature death of leaf tissue"], "treatment": ["Apply strobilurin or triazole fungicide", "Scout fields from tasseling stage", "Apply when 5% of plants show symptoms"], "prevention": ["Plant resistant hybrids", "Rotate with non-host crops", "Manage crop residue by tillage"], "riskLevel": "Medium"},
    "Corn_(maize)___Common_rust_": {"display": "Corn Common Rust", "symptoms": ["Oval cinnamon-brown pustules on both leaf surfaces", "Pustules turn dark brown to black with age", "Severe infection causes yellowing"], "treatment": ["Apply propiconazole or azoxystrobin fungicide", "Spray at early pustule stage"], "prevention": ["Plant resistant corn hybrids", "Early planting to avoid peak rust season"], "riskLevel": "Medium"},
    "Corn_(maize)___Northern_Leaf_Blight": {"display": "Corn Northern Leaf Blight", "symptoms": ["Long cigar-shaped gray-green to tan lesions", "Lesions can be 1-6 inches long", "Grayish-green sporulation on lesions", "Entire leaf may die in severe cases"], "treatment": ["Apply fungicide at or before tasseling", "Use strobilurin or triazole fungicides"], "prevention": ["Plant resistant hybrids with Ht genes", "Crop rotation with non-host crops"], "riskLevel": "High"},
    "Corn_(maize)___healthy": {"display": "Healthy Corn Plant", "symptoms": ["No disease symptoms detected"], "treatment": ["No treatment required"], "prevention": ["Regular field scouting", "Crop rotation"], "riskLevel": "Low"},
    "Grape___Black_rot": {"display": "Grape Black Rot", "symptoms": ["Small yellowish spots on leaves turning brown", "Black pycnidia dots in lesion centers", "Fruit turns brown then shrivels to black mummies"], "treatment": ["Apply mancozeb captan or myclobutanil", "Spray from bud break every 10-14 days", "Remove mummified berries"], "prevention": ["Remove all mummified fruits and debris", "Prune for good air circulation", "Apply dormant lime sulfur spray"], "riskLevel": "High"},
    "Grape___Esca_(Black_Measles)": {"display": "Grape Esca (Black Measles)", "symptoms": ["Tiger-stripe pattern on leaves", "Berries show dark spots (measles)", "Wood shows internal brown streaking", "Sudden wilting of entire shoots"], "treatment": ["No effective curative treatment", "Prune out infected wood in dry weather", "Paint pruning wounds with wound protectant"], "prevention": ["Use clean planting material", "Make pruning cuts during dry weather", "Apply wound protectant after pruning"], "riskLevel": "High"},
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {"display": "Grape Isariopsis Leaf Spot", "symptoms": ["Dark brown angular spots on leaves", "Spots surrounded by yellow halo", "Spots may merge causing leaf blight"], "treatment": ["Apply copper-based fungicide", "Use mancozeb or carbendazim spray"], "prevention": ["Maintain good air circulation", "Avoid overhead irrigation"], "riskLevel": "Medium"},
    "Grape___healthy": {"display": "Healthy Grape Plant", "symptoms": ["No disease symptoms detected"], "treatment": ["No treatment required"], "prevention": ["Regular monitoring", "Proper canopy management"], "riskLevel": "Low"},
    "Orange___Haunglongbing_(Citrus_greening)": {"display": "Citrus Greening (HLB)", "symptoms": ["Asymmetric yellow mottling on leaves", "Small misshapen bitter fruit", "Fruit may remain green at maturity", "Premature fruit drop and twig dieback"], "treatment": ["No cure exists for HLB", "Remove and destroy infected trees", "Control Asian citrus psyllid vector"], "prevention": ["Use certified HLB-free planting material", "Control psyllid populations aggressively", "Inspect trees regularly"], "riskLevel": "High"},
    "Peach___Bacterial_spot": {"display": "Peach Bacterial Spot", "symptoms": ["Small water-soaked spots on leaves turning purple-brown", "Spots with yellow halos", "Fruit develops sunken pits and cracks"], "treatment": ["Apply copper bactericide every 5-7 days in wet weather", "Avoid pruning in wet conditions"], "prevention": ["Plant resistant varieties", "Apply copper dormant spray", "Avoid overhead irrigation"], "riskLevel": "Medium"},
    "Peach___healthy": {"display": "Healthy Peach Plant", "symptoms": ["No disease symptoms detected"], "treatment": ["No treatment required"], "prevention": ["Regular monitoring", "Good sanitation"], "riskLevel": "Low"},
    "Pepper,_bell___Bacterial_spot": {"display": "Bell Pepper Bacterial Spot", "symptoms": ["Small water-soaked spots on leaves", "Spots turn dark brown with yellow margins", "Fruit develops raised scab-like spots"], "treatment": ["Apply copper-based bactericide every 5-7 days", "Remove heavily infected plant material"], "prevention": ["Use disease-free certified seed", "Avoid working in wet fields", "Rotate crops"], "riskLevel": "Medium"},
    "Pepper,_bell___healthy": {"display": "Healthy Bell Pepper Plant", "symptoms": ["No disease symptoms detected"], "treatment": ["No treatment required"], "prevention": ["Regular monitoring", "Proper spacing"], "riskLevel": "Low"},
    "Potato___Early_blight": {"display": "Potato Early Blight", "symptoms": ["Dark brown spots with concentric rings on older leaves", "Yellow halo surrounding lesions", "Lesions start on lower leaves and move up", "Severe defoliation reduces tuber yield"], "treatment": ["Apply chlorothalonil mancozeb or azoxystrobin", "Begin when plants are 6 inches tall", "Repeat every 7-10 days in humid conditions"], "prevention": ["Use certified disease-free seed potatoes", "Rotate crops for 2+ years", "Maintain adequate soil fertility"], "riskLevel": "Medium"},
    "Potato___Late_blight": {"display": "Potato Late Blight", "symptoms": ["Water-soaked pale green lesions on leaves", "Lesions turn dark brown to black rapidly", "White fluffy sporulation on leaf undersides", "Tubers develop reddish-brown dry rot"], "treatment": ["Apply Ridomil Gold metalaxyl or mancozeb immediately", "Spray every 5-7 days in wet weather", "Destroy infected plants including tubers"], "prevention": ["Use certified disease-free seed potatoes", "Plant resistant varieties", "Monitor weather forecasts for blight conditions"], "riskLevel": "High"},
    "Potato___healthy": {"display": "Healthy Potato Plant", "symptoms": ["No disease symptoms detected"], "treatment": ["No treatment required"], "prevention": ["Regular field monitoring", "Crop rotation"], "riskLevel": "Low"},
    "Raspberry___healthy": {"display": "Healthy Raspberry Plant", "symptoms": ["No disease symptoms detected"], "treatment": ["No treatment required"], "prevention": ["Regular monitoring", "Proper cane management"], "riskLevel": "Low"},
    "Soybean___healthy": {"display": "Healthy Soybean Plant", "symptoms": ["No disease symptoms detected"], "treatment": ["No treatment required"], "prevention": ["Regular scouting", "Crop rotation"], "riskLevel": "Low"},
    "Squash___Powdery_mildew": {"display": "Squash Powdery Mildew", "symptoms": ["White powdery coating on leaf surfaces", "Leaves turn yellow and die prematurely", "Reduced fruit yield", "Both sides of leaves affected"], "treatment": ["Apply potassium bicarbonate sulfur or neem oil", "Use systemic fungicides like myclobutanil", "Remove severely affected leaves"], "prevention": ["Plant resistant varieties", "Ensure good air circulation", "Avoid excessive nitrogen"], "riskLevel": "Medium"},
    "Strawberry___Leaf_scorch": {"display": "Strawberry Leaf Scorch", "symptoms": ["Small dark purple spots on upper leaf surface", "Spots enlarge and centers turn brown", "Leaf margins appear scorched and burnt"], "treatment": ["Apply captan or myclobutanil fungicide", "Remove and destroy infected leaves", "Improve air circulation"], "prevention": ["Plant in well-drained sites", "Avoid overhead irrigation", "Rotate strawberry beds every 3-4 years"], "riskLevel": "Medium"},
    "Strawberry___healthy": {"display": "Healthy Strawberry Plant", "symptoms": ["No disease symptoms detected"], "treatment": ["No treatment required"], "prevention": ["Regular monitoring", "Good bed management"], "riskLevel": "Low"},
    "Tomato___Bacterial_spot": {"display": "Tomato Bacterial Spot", "symptoms": ["Small water-soaked spots on leaves turning dark brown", "Spots with yellow margins", "Fruit develops raised scab-like spots", "Severe defoliation in wet conditions"], "treatment": ["Apply copper-based bactericide every 5-7 days", "Add mancozeb to copper for better control"], "prevention": ["Use disease-free certified seed", "Avoid overhead irrigation", "Rotate crops for 2+ years"], "riskLevel": "Medium"},
    "Tomato___Early_blight": {"display": "Tomato Early Blight", "symptoms": ["Dark brown concentric ring spots on lower leaves", "Yellow halo surrounding target-like lesions", "Defoliation beginning from bottom leaves"], "treatment": ["Apply chlorothalonil mancozeb or azoxystrobin", "Remove and destroy lower infected leaves", "Repeat every 7-10 days"], "prevention": ["Mulch around plants to prevent soil splash", "Water at soil level", "Practice 3-year crop rotation"], "riskLevel": "Medium"},
    "Tomato___Late_blight": {"display": "Tomato Late Blight", "symptoms": ["Large irregular dark brown water-soaked lesions", "White mold on leaf undersides in humid weather", "Rapid browning and death of affected tissue", "Brown lesions on stems and greasy spots on fruit"], "treatment": ["Apply copper fungicide or Ridomil immediately", "Spray every 5-7 days in wet cool weather", "Remove and destroy all infected plant material"], "prevention": ["Plant resistant varieties", "Ensure proper spacing for air circulation", "Avoid overhead irrigation", "Rotate crops every season"], "riskLevel": "High"},
    "Tomato___Leaf_Mold": {"display": "Tomato Leaf Mold", "symptoms": ["Pale greenish-yellow spots on upper leaf surface", "Olive-green to grayish-purple mold on leaf undersides", "Affected leaves wither and drop"], "treatment": ["Apply mancozeb chlorothalonil or copper fungicide", "Improve greenhouse ventilation", "Reduce humidity by improving air circulation"], "prevention": ["Use resistant varieties", "Maintain humidity below 85%", "Avoid overhead watering"], "riskLevel": "Medium"},
    "Tomato___Septoria_leaf_spot": {"display": "Tomato Septoria Leaf Spot", "symptoms": ["Numerous small circular spots with dark brown margins", "White or gray centers with dark specks", "Lower leaves affected first then moves upward"], "treatment": ["Apply mancozeb chlorothalonil or copper fungicide", "Remove infected leaves immediately", "Apply fungicide every 7-10 days during wet weather"], "prevention": ["Rotate crops for 2+ years", "Use mulch to prevent soil splash", "Stake plants to improve air circulation"], "riskLevel": "Medium"},
    "Tomato___Spider_mites Two-spotted_spider_mite": {"display": "Tomato Spider Mites", "symptoms": ["Fine stippling or bronzing on upper leaf surface", "Webbing visible on undersides of leaves", "Leaves turn yellow bronze then brown"], "treatment": ["Apply miticide like abamectin or bifenazate", "Use insecticidal soap or neem oil spray", "Spray undersides of leaves thoroughly"], "prevention": ["Avoid plant stress (heat and drought stress increase mite populations)", "Introduce predatory mites", "Monitor regularly in hot dry weather"], "riskLevel": "Medium"},
    "Tomato___Target_Spot": {"display": "Tomato Target Spot", "symptoms": ["Brown spots with concentric rings on leaves", "Spots may have yellow halo", "Lesions on fruit appear as dark sunken spots"], "treatment": ["Apply azoxystrobin chlorothalonil or mancozeb", "Begin at first sign of disease", "Repeat every 7-14 days"], "prevention": ["Crop rotation", "Avoid overhead irrigation", "Remove infected plant material"], "riskLevel": "Medium"},
    "Tomato___Tomato_YellowLeaf__Curl_Virus": {"display": "Tomato Yellow Leaf Curl Virus", "symptoms": ["Upward curling and yellowing of leaf margins", "Leaves smaller than normal with crumpled appearance", "Stunted plant growth", "Severe fruit set reduction"], "treatment": ["No cure — remove and destroy infected plants", "Control whitefly vector with imidacloprid", "Use reflective mulches to deter whiteflies"], "prevention": ["Use TYLCV-resistant tomato varieties", "Use insect-proof nets in seedling nurseries", "Control weeds around fields"], "riskLevel": "High"},
    "Tomato___Tomato_mosaic_virus": {"display": "Tomato Mosaic Virus", "symptoms": ["Mottled light and dark green mosaic pattern on leaves", "Leaf distortion and malformation", "Stunted plant growth"], "treatment": ["No cure available", "Remove and destroy infected plants", "Disinfect tools with 10% bleach or milk solution"], "prevention": ["Use certified virus-free seeds", "Disinfect all tools between plants", "Control aphid vectors"], "riskLevel": "High"},
    "Tomato___healthy": {"display": "Healthy Tomato Plant", "symptoms": ["No disease symptoms detected", "Leaves appear dark green and vigorous"], "treatment": ["No treatment required", "Continue regular monitoring"], "prevention": ["Regular inspection every 3-4 days", "Balanced NPK fertilization", "Consistent irrigation management"], "riskLevel": "Low"},
}

_model = None
_class_names = None

def _normalize_key(name: str) -> str:
    """Normalize PlantVillage-style class names so naming quirks
    (single vs double vs triple underscore, commas, spaces) don't
    cause lookup misses between class_names.json and DISEASE_INFO."""
    return name.replace(",", "").replace(" ", "_").replace("-", "_").lower().replace("___", "_").replace("__", "_")

_DISEASE_INFO_NORMALIZED = {_normalize_key(k): v for k, v in DISEASE_INFO.items()}

def get_class_names():
    global _class_names
    if _class_names is None:
        if os.path.exists(CLASS_NAMES_PATH):
            import json
            with open(CLASS_NAMES_PATH) as f:
                _class_names = json.load(f)
        else:
            _class_names = list(DISEASE_INFO.keys())
    return _class_names

def load_model():
    global _model
    if _model is None:
        import tensorflow as tf
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model not found at {MODEL_PATH}. "
                "Please train the model first using Google Colab. "
                "See TRAINING_GUIDE.md in the project root."
            )
        _model = tf.keras.models.load_model(MODEL_PATH)
    return _model

CONFIDENCE_THRESHOLD = 0.60  # below this, flag result as uncertain
GREEN_PIXEL_THRESHOLD = 0.12  # min fraction of green-dominant pixels to look "plant-like"

class NotPlantError(Exception):
    """Raised when the uploaded image doesn't look like it contains a plant/leaf."""
    pass

def _looks_like_plant(img: Image.Image) -> bool:
    """Cheap heuristic: leaf photos are dominated by green-ish pixels
    (green channel notably higher than red and blue). This won't catch
    every edge case (e.g. a yellowed/browned diseased leaf with little
    green left), so it's intentionally lenient — it's meant to reject
    obviously unrelated photos (people, screenshots, buildings, etc.),
    not to judge plant health."""
    small = img.resize((64, 64))
    arr = np.array(small, dtype=np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    green_dominant = (g > r + 10) & (g > b + 10)
    green_fraction = float(np.mean(green_dominant))
    return green_fraction >= GREEN_PIXEL_THRESHOLD

def _crop_prefix(class_name: str) -> str:
    """Extract the crop name prefix from a class name, e.g.
    'Tomato___Late_blight' -> 'tomato', 'Pepper__bell___healthy' -> 'pepper'."""
    norm = _normalize_key(class_name)
    return norm.split("_")[0]

def predict_image(image_bytes: bytes, crop_filter: str = None) -> dict:
    model = load_model()
    class_names = get_class_names()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    if not _looks_like_plant(img):
        raise NotPlantError(
            "This doesn't look like a plant leaf. Please upload a clear photo of a crop leaf."
        )

    img = img.resize((224, 224))
    arr = np.array(img, dtype=np.float32) / 255.0
    arr = np.expand_dims(arr, axis=0)
    predictions = model.predict(arr, verbose=0)[0]

    # Build list of (index, confidence) sorted high to low
    order = np.argsort(predictions)[::-1]

    # If a crop filter was given (e.g. "Tomato"), restrict candidates to
    # classes whose prefix matches. Falls back to all classes if the
    # filter doesn't match anything (e.g. user picked a crop the model
    # wasn't trained on) so we never return an empty result.
    if crop_filter:
        wanted_prefix = _normalize_key(crop_filter).split("_")[0]
        filtered_order = [i for i in order if _crop_prefix(class_names[i]) == wanted_prefix]
        if filtered_order:
            order = filtered_order

    top_idx = int(order[0])
    confidence = float(predictions[top_idx])
    disease_key = class_names[top_idx] if top_idx < len(class_names) else "Tomato___healthy"
    info = _DISEASE_INFO_NORMALIZED.get(_normalize_key(disease_key))
    if info is None:
        info = DISEASE_INFO["Tomato___healthy"]

    # Top 3 alternatives (within the filtered candidate set) for context
    top3 = []
    for i in order[:3]:
        key = class_names[int(i)] if int(i) < len(class_names) else "Tomato___healthy"
        alt_info = _DISEASE_INFO_NORMALIZED.get(_normalize_key(key))
        top3.append({
            "disease": alt_info["display"] if alt_info else key,
            "confidence": float(predictions[int(i)])
        })

    return {
        "disease": info["display"],
        "confidence": confidence,
        "isUncertain": confidence < CONFIDENCE_THRESHOLD,
        "topPredictions": top3,
        "symptoms": info["symptoms"],
        "treatment": info["treatment"],
        "prevention": info["prevention"],
        "riskLevel": info["riskLevel"]
    }