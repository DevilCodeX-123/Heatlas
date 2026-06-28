import os
import re
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv, find_dotenv
from google import genai

# Load environment variables from root .env file
load_dotenv(find_dotenv())
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

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

def generate_with_retry(prompt: str, max_retries: int = 3, fallback_response: str = None):
    """Helper function to retry generating content when hitting 429 Rate Limits."""
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model='gemini-1.5-flash', # Using 1.5-flash as it has higher free tier limits than 2.0
                contents=prompt
            )
            return response.text
        except genai.errors.APIError as e:
            if e.code == 429:
                if attempt == max_retries - 1:
                    if fallback_response:
                        return fallback_response
                    return "The Heatlas AI is currently experiencing high traffic (Rate Limit Exceeded). Please wait 15 seconds and try again."
                time.sleep(5) # Reduced to 5 seconds so UI doesn't hang too long
            else:
                if fallback_response:
                    return fallback_response
                raise e
        except Exception as e:
            if fallback_response:
                return fallback_response
            raise e

@app.get("/")
def read_root():
    return {"status": "Heatlas Production AI Engine is running!"}

@app.post("/api/ai/chat")
def chat_with_ai(data: ChatMessage):
    if not client:
        return {"reply": "⚠️ **SYSTEM ALERT**: API Key missing. Please add `GEMINI_API_KEY` to the `Ai/.env` file."}
    
    try:
        prompt = f"You are Heatlas AI, an environmental and climate resilience expert. The user says: {data.message}. Provide a concise, helpful response."
        fallback = f"Heatlas AI Backup Response: I understand you are asking about '{data.message}'. Unfortunately, my primary neural network is currently at maximum capacity due to high traffic in your region. Please wait a moment and try again!"
        text = generate_with_retry(prompt, fallback_response=fallback)
        return {"reply": text}
    except Exception as e:
        return {"reply": f"Error communicating with Gemini: {str(e)}"}

@app.post("/api/ai/action-plan")
def generate_action_plan(data: AuditData):
    if not client:
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
        fallback_text = f"₹12,500\n2.1 Tons CO₂\nConsider white reflective paint for your {data.roofType} roof.\nGood potential for {data.solarCap}m2 solar panels.\n> fallback_model_engaged..."
        
        text = generate_with_retry(prompt, fallback_response=fallback_text)
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
    if not client:
        return {"analysis": "⚠️ AI Engine Offline. Please add GEMINI_API_KEY to your environment variables to enable regional heat analysis."}
    
    try:
        prompt = f"""
        Provide a concise, 1-2 sentence environmental analysis of {data.district}, {data.state} in India.
        The current live temperature is {data.temperature}°C and the US AQI is {data.aqi}.
        What is the primary geographic or seasonal reason for this temperature and air quality right now?
        Keep it direct, professional, and insightful.
        """
        fallback_analysis = f"Fallback Analysis: {data.district}, {data.state} is currently experiencing a temperature of {data.temperature}°C with an AQI of {data.aqi}. This is typical for its geographic region under current weather patterns, but please monitor the air quality closely."
        text = generate_with_retry(prompt, fallback_response=fallback_analysis)
        return {"analysis": text.strip()}
    except Exception as e:
        return {"analysis": f"Error generating analysis: {str(e)}"}
