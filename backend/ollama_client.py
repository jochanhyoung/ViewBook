import httpx
import base64
import json
import os
from fastapi import HTTPException
from schemas import VisualizationStep

async def analyze_image(image_bytes: bytes, prompt: str) -> VisualizationStep:
    encoded = base64.b64encode(image_bytes).decode()
    payload = {
        "model": os.getenv("OLLAMA_MODEL", "gemma4:latest"),
        "prompt": prompt,
        "images": [encoded],
        "stream": False,
        "format": "json"
    }
    timeout = float(os.getenv("OLLAMA_TIMEOUT_SEC", "120"))
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(
            f"{os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')}/api/generate",
            json=payload
        )
        response.raise_for_status()
    try:
        data = json.loads(response.json()["response"])
        return VisualizationStep(**data)
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        raise HTTPException(status_code=500, detail=f"모델 응답 파싱 실패: {str(e)}")
