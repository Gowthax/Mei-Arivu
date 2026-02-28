from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MeiValam API")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and encoders with safety checks
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
REQUIRED_MODELS = ["regressor.pkl", "classifier.pkl", "waste_encoder.pkl", "action_encoder.pkl"]

for model_file in REQUIRED_MODELS:
    path = os.path.join(MODEL_DIR, model_file)
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"Missing model file: {path}. Run 'python generate_mock_data.py' then 'python train_model.py' first."
        )

with open(os.path.join(MODEL_DIR, "regressor.pkl"), "rb") as f:
    regressor = pickle.load(f)
with open(os.path.join(MODEL_DIR, "classifier.pkl"), "rb") as f:
    classifier = pickle.load(f)
with open(os.path.join(MODEL_DIR, "waste_encoder.pkl"), "rb") as f:
    waste_encoder = pickle.load(f)
with open(os.path.join(MODEL_DIR, "action_encoder.pkl"), "rb") as f:
    action_encoder = pickle.load(f)

VALID_WASTE_TYPES = list(waste_encoder.classes_)

class PredictRequest(BaseModel):
    temperature_celsius: float
    moisture_percent: float
    ph_level: float
    carbon_nitrogen_ratio: float
    waste_type: str

def generate_explanation(action: str) -> str:
    explanations = {
        'Add_Sawdust_Carbon': "The pile is nitrogen-rich. Adding sawdust (carbon) restores the optimal C:N ratio, mitigating ammonia volatilization and supporting microbial protein synthesis.",
        'Add_Water': "Moisture is critically low. Adding water reactivates dormant thermophilic bacteria, facilitating enzymatic hydrolysis of complex organic polymers.",
        'Add_Bacillus_Enzyme': "Temperatures are suboptimal for active decomposition. Inoculating with Bacillus enzymes accelerates the degradation of recalcitrant cellulose and hemicellulose.",
        'Turn_Pile_Aeration': "High temperatures or excess moisture indicate anaerobic pockets or overheating. Turning the pile replenishes oxygen, preventing methanogenesis and stabilizing aerobic respiration.",
        'Optimal_No_Action': "Biochemical parameters are within optimal ranges. The microbial consortium is actively degrading organic matter at maximum efficiency."
    }
    return explanations.get(action, "Take appropriate action to optimize parameters.")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "models_loaded": True, "valid_waste_types": VALID_WASTE_TYPES}

@app.post("/api/predict")
def predict(request: PredictRequest):
    try:
        # Validate waste type
        if request.waste_type not in VALID_WASTE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid waste_type '{request.waste_type}'. Must be one of: {VALID_WASTE_TYPES}"
            )
        
        # Encode waste type
        waste_encoded = waste_encoder.transform([request.waste_type])[0]
        
        # Prepare features
        features = pd.DataFrame([{
            'temperature_celsius': request.temperature_celsius,
            'moisture_percent': request.moisture_percent,
            'ph_level': request.ph_level,
            'carbon_nitrogen_ratio': request.carbon_nitrogen_ratio,
            'waste_type_encoded': waste_encoded
        }])
        
        # Predict
        days_pred = int(regressor.predict(features)[0])
        action_pred_encoded = classifier.predict(features)[0]
        action_pred = action_encoder.inverse_transform([action_pred_encoded])[0]
        
        explanation = generate_explanation(action_pred)
        
        return {
            "days_to_degrade": days_pred,
            "required_action": action_pred,
            "explanation": explanation
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
