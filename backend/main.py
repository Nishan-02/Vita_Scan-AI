import os
import json
import io
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# --- 1. APP SETUP ---
app = FastAPI()

# Enable CORS (Critical for React Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins (Easiest for testing)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. ROBUST PATH SETUP ---
# This ensures we find files even if you run the terminal from a different folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "skin_model_weights.pth")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "class_names.json")

# --- 3. LOAD MODEL & CLASS NAMES ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🚀 Using device: {device}")

# Load Class Names
if os.path.exists(CLASS_NAMES_PATH):
    with open(CLASS_NAMES_PATH, "r") as f:
        class_names = json.load(f)
    print(f"✅ Loaded {len(class_names)} classes.")
else:
    print("⚠️ WARNING: class_names.json not found in backend folder!")
    class_names = ["Unknown"] * 22  # Fallback to prevent crash

# Load Model Architecture (ResNet50)
model = models.resnet50(weights=None)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, len(class_names))

# Load Weights
if os.path.exists(MODEL_PATH):
    try:
        # map_location ensures it loads on CPU if you don't have a GPU locally
        state_dict = torch.load(MODEL_PATH, map_location=device)
        model.load_state_dict(state_dict)
        model.to(device)
        model.eval()
        print("✅ Model weights loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading model weights: {e}")
else:
    print(f"❌ Error: Model file not found at {MODEL_PATH}")

# Image Preprocessing (Must match training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

## --- 4. EXPANDED VITAMIN DATABASE ---
# This dictionary maps keywords found in your folder names to advice.
vitamin_db = {
    "eczema": {
        "condition": "Eczema",
        "deficiency": "Vitamin D, Omega-3",
        "foods": ["Salmon", "Walnuts", "Flaxseeds", "Yogurt"],
        "advice": "Low Vitamin D is linked to eczema. Omega-3s help reduce itching."
    },
    "atopic": {
        "condition": "Atopic Dermatitis",
        "deficiency": "Vitamin D, Omega-3",
        "foods": ["Salmon", "Walnuts", "Flaxseeds", "Yogurt"],
        "advice": "Hydration is key. Omega-3s help reduce inflammation."
    },
    "melanoma": {
        "condition": "Melanoma / Moles",
        "deficiency": "None - MEDICAL ATTENTION REQUIRED",
        "foods": ["Leafy Greens"],
        "advice": "CRITICAL: This resembles a serious condition. Consult a dermatologist immediately."
    },
    "basal": {
        "condition": "Basal Cell Carcinoma",
        "deficiency": "Vitamin B3 (Nicotinamide)",
        "foods": ["Chicken", "Tuna", "Avocado", "Peanuts"],
        "advice": "Research suggests Vitamin B3 may help skin health, but medical treatment is required."
    },
    "carcinoma": { # Backup for Basal Cell
        "condition": "Skin Carcinoma",
        "deficiency": "Vitamin B3 (Nicotinamide)",
        "foods": ["Chicken", "Tuna", "Avocado", "Peanuts"],
        "advice": "Research suggests Vitamin B3 may help skin health, but medical treatment is required."
    },
    "warts": {
        "condition": "Warts (Viral)",
        "deficiency": "Zinc",
        "foods": ["Beans", "Nuts", "Whole Grains", "Shellfish"],
        "advice": "Zinc supports the immune system in fighting viral warts."
    },
    "molluscum": { # Often grouped with Warts
        "condition": "Molluscum / Warts",
        "deficiency": "Zinc",
        "foods": ["Beans", "Nuts", "Whole Grains"],
        "advice": "Zinc supports the immune system in fighting viral infections."
    },
    "acne": {
        "condition": "Acne / Rosacea",
        "deficiency": "Vitamin A, Zinc",
        "foods": ["Carrots", "Pumpkin Seeds", "Spinach"],
        "advice": "Zinc reduces inflammation. Vitamin A supports skin repair."
    },
    "rosacea": {
        "condition": "Acne / Rosacea",
        "deficiency": "Vitamin A, Zinc",
        "foods": ["Carrots", "Pumpkin Seeds", "Spinach"],
        "advice": "Zinc reduces inflammation. Vitamin A supports skin repair."
    },
    "psoriasis": {
        "condition": "Psoriasis",
        "deficiency": "Vitamin D",
        "foods": ["Salmon", "Egg Yolks", "Mushrooms"],
        "advice": "Strong link between Vitamin D deficiency and Psoriasis flare-ups."
    },
    "lichen": {
        "condition": "Lichen Planus",
        "deficiency": "Vitamin D",
        "foods": ["Salmon", "Egg Yolks", "Mushrooms"],
        "advice": "Ensure adequate Vitamin D levels."
    },
    "tinea": {
        "condition": "Fungal Infection (Tinea)",
        "deficiency": "Iron, Zinc",
        "foods": ["Garlic", "Lean Meat", "Pumpkin Seeds"],
        "advice": "Fungal infections can persist if immunity (Zinc) is low."
    },
    "fungus": {
        "condition": "Fungal Infection",
        "deficiency": "Iron, Zinc",
        "foods": ["Garlic", "Lean Meat", "Pumpkin Seeds"],
        "advice": "Fungal infections can persist if immunity (Zinc) is low."
    },
    "keratosis": {
        "condition": "Actinic / Seborrheic Keratosis",
        "deficiency": "Vitamin B3, Vitamin D",
        "foods": ["Fish", "Eggs", "Chicken"],
        "advice": "Vitamin B3 (Niacinamide) is often recommended for sun-damaged skin."
    },
    "nail": {
        "condition": "Nail Disease",
        "deficiency": "Biotin (B7), Iron",
        "foods": ["Eggs", "Almonds", "Sweet Potatoes"],
        "advice": "Brittle nails often signal a need for Biotin or Iron."
    }

}

def get_nutritional_info(prediction_text):
    """
    Searches the database for keywords in the prediction (e.g., '1. Eczema 1677' -> matches 'Eczema')
    """
    prediction_lower = prediction_text.lower()
    
    for key, info in vitamin_db.items():
        if key.lower() in prediction_lower:
            return info
            
    # Default Fallback
    return {
        "condition": prediction_text,
        "deficiency": "No specific deficiency linked in database.",
        "foods": ["Balanced Diet", "Hydration"],
        "advice": "Please consult a dermatologist for an accurate diagnosis."
    }

# --- 5. API ENDPOINTS ---

@app.get("/")
def home():
    return {"message": "VitaScan AI Backend is Running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # 1. Validate File
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # 2. Read & Process Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        input_tensor = transform(image).unsqueeze(0).to(device)

        # 3. Predict
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_idx = torch.max(probabilities, 1)

        # 4. Get Result Data
        predicted_label = class_names[predicted_idx.item()]
        confidence_score = confidence.item() * 100
        
        # 5. Get Advice
        advice_data = get_nutritional_info(predicted_label)

        return {
            "prediction": advice_data["condition"],
            "confidence": f"{confidence_score:.2f}%",
            "deficiency": advice_data["deficiency"],
            "foods": advice_data["foods"],
            "advice": advice_data["advice"],
            "raw_label": predicted_label # Useful for debugging
        }

    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)