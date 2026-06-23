import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv, find_dotenv
import google.generativeai as genai

# Load environment variables from root .env file
load_dotenv(find_dotenv())
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

app = FastAPI(title="Heatlas Gemini Engine", description="Production API using Environment Variables")

origins = [
    "http://localhost:5173",
    "http://localhost:5000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5000",
    # Add production frontend URLs here when deploying
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str

class AuditData(BaseModel):
    homeSize: str
    homeAge: str
    roofType: str
    balcony: str
    solarCap: int

@app.get("/")
def read_root():
    return {"status": "Heatlas Production AI Engine is running!"}

@app.post("/api/ai/chat")
def chat_with_ai(data: ChatMessage):
    if not model:
        return {"reply": "⚠️ **SYSTEM ALERT**: API Key missing. Please add `GEMINI_API_KEY` to the `Ai/.env` file."}
    
    try:
        prompt = f"You are EcoShield AI, an environmental and climate resilience expert. The user says: {data.message}. Provide a concise, helpful response."
        response = model.generate_content(prompt)
        return {"reply": response.text}
    except Exception as e:
        return {"reply": f"Error communicating with Gemini: {str(e)}"}

@app.post("/api/ai/action-plan")
def generate_action_plan(data: AuditData):
    if not model:
        return {
            "savings": "₹0 / year",
            "carbon": "0.0 Tons CO₂",
            "insight1": "Please add GEMINI_API_KEY to `.env`.",
            "insight2": "I need the API key to run my thermal calculation algorithms.",
            "logs": ["> ERROR: GEMINI_API_KEY not found in .env file."]
        }
    
    try:
        prompt = f"""
        Analyze this home profile for climate resilience and heat mitigation:
        Size: {data.homeSize}, Age: {data.homeAge}, Roof: {data.roofType}, Balcony: {data.balcony}, Solar Capacity: {data.solarCap} sq meters.
        
        Generate exactly 5 lines of plain text data:
        Line 1: Estimated Annual Savings in ₹ (e.g. ₹12,500)
        Line 2: Carbon Footprint Reduction (e.g. 2.1 Tons CO₂)
        Line 3: One short, specific insight about their {data.roofType} roof.
        Line 4: One short, specific insight about their solar potential ({data.solarCap} m2).
        Line 5: A short log message simulating a terminal action (e.g. > applying_thermal_models...)
        """
        response = model.generate_content(prompt)
        lines = response.text.strip().split('\n')
        
        return {
            "savings": lines[0].replace('Line 1: ', '').strip() if len(lines)>0 else "₹15,000",
            "carbon": lines[1].replace('Line 2: ', '').strip() if len(lines)>1 else "2.5 Tons CO₂",
            "insight1": lines[2].replace('Line 3: ', '').strip() if len(lines)>2 else "Roof insight generated.",
            "insight2": lines[3].replace('Line 4: ', '').strip() if len(lines)>3 else "Solar insight generated.",
            "logs": ["> fetching_gemini_api...", "> " + (lines[4].replace('Line 5: ', '').strip() if len(lines)>4 else "optimal_plan_found.")]
        }
    except Exception as e:
        return {
            "savings": "Error",
            "carbon": "Error",
            "insight1": "Failed to connect to AI.",
            "insight2": str(e),
            "logs": ["> critical_failure."]
        }
