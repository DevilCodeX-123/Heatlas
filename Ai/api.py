import os
import re
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv, find_dotenv
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted

# Load environment variables from root .env file
load_dotenv(find_dotenv())
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Using 2.5-flash for better free-tier rate limits than 3.5
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None

app = FastAPI(title="Heatlas Gemini Engine", description="Production API using Environment Variables")

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5000",
    # Add production frontend URLs here when deploying
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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

class DistrictData(BaseModel):
    district: str
    state: str
    temperature: float
    aqi: int

def generate_with_retry(prompt: str, max_retries: int = 3):
    """Helper function to retry generating content when hitting 429 Rate Limits."""
    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            return response.text
        except ResourceExhausted as e:
            if attempt == max_retries - 1:
                return "The Heatlas AI is currently experiencing high traffic (Rate Limit Exceeded). Please wait 15 seconds and try again."
            time.sleep(15) # Wait 15 seconds before retrying
        except Exception as e:
            if "429" in str(e):
                if attempt == max_retries - 1:
                    return "The Heatlas AI is currently experiencing high traffic (Rate Limit Exceeded). Please wait 15 seconds and try again."
                time.sleep(15)
            else:
                raise e

@app.get("/")
def read_root():
    return {"status": "Heatlas Production AI Engine is running!"}

@app.post("/api/ai/chat")
def chat_with_ai(data: ChatMessage):
    if not model:
        return {"reply": "⚠️ **SYSTEM ALERT**: API Key missing. Please add `GEMINI_API_KEY` to the `Ai/.env` file."}
    
    try:
        prompt = f"You are Heatlas AI, an environmental and climate resilience expert. The user says: {data.message}. Provide a concise, helpful response."
        text = generate_with_retry(prompt)
        return {"reply": text}
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
        text = generate_with_retry(prompt)
        lines = text.strip().split('\n')
        
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

@app.post("/api/ai/district-analysis")
def district_analysis(data: DistrictData):
    if not model:
        return {"analysis": "⚠️ AI Engine Offline. Please add GEMINI_API_KEY to your environment variables to enable regional heat analysis."}
    
    try:
        prompt = f"""
        Provide a concise, 1-2 sentence environmental analysis of {data.district}, {data.state} in India.
        The current live temperature is {data.temperature}°C and the US AQI is {data.aqi}.
        What is the primary geographic or seasonal reason for this temperature and air quality right now?
        Keep it direct, professional, and insightful.
        """
        text = generate_with_retry(prompt)
        return {"analysis": text.strip()}
    except Exception as e:
        return {"analysis": f"Error generating analysis: {str(e)}"}
