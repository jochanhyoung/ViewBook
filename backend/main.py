from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from dotenv import load_dotenv
import os

load_dotenv()

from schemas import VisualizationStep
from ollama_client import analyze_image
from prompt_builder import build_prompt

_is_prod = os.getenv("ENV", "development") == "production"
app = FastAPI(
    title="B2G Digital Textbook AI API",
    docs_url=None if _is_prod else "/docs",
    redoc_url=None if _is_prod else "/redoc",
    openapi_url=None if _is_prod else "/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGIN", "http://15.165.43.42:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("API_KEY")
api_key_header = APIKeyHeader(name="X-API-Key")

async def verify_api_key(key: str = Security(api_key_header)):
    if key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/analyze", response_model=VisualizationStep)
async def analyze(
    image: UploadFile = File(...),
    question: str = Form(None),
    _: str = Security(verify_api_key)
):
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="JPG, PNG, WEBP만 허용됩니다.")
    
    image_bytes = await image.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="파일 크기는 10MB 이하여야 합니다.")
    
    safe_question = question[:500] if question else None
    prompt = build_prompt(safe_question)
    return await analyze_image(image_bytes, prompt)
