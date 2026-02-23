from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from auth import get_current_user
from ai_clients import flux_generate, dalle_generate
import asyncio

router = APIRouter(prefix="/images", tags=["Images"])

class ImageRequest(BaseModel):
    prompt: str
    aspect_ratio: Optional[str] = "1:1"
    model: Optional[str] = "flux" # "flux" or "dalle"

class InstagramImageRequest(BaseModel):
    product_description: str
    style: Optional[str] = "photorealistic"  # photorealistic, lifestyle, minimalist, vibrant
    aspect_ratio: Optional[str] = "1:1"  # 1:1, 4:5 (for feed), 9:16 (for stories)
    model: Optional[str] = "flux"

def enhance_prompt_for_realism(prompt: str, style: str) -> str:
    """Enhance prompt to generate realistic, non-AI-looking Instagram images."""
    style_keywords = {
        "photorealistic": "Shot on professional camera with natural lighting, studio-quality, 85mm lens, shallow depth of field, cinematic color grading, highly detailed",
        "lifestyle": "Candid lifestyle photography, natural setting, warm ambient lighting, editorial style, authentic moment captured, professional composition",
        "minimalist": "Minimalist design, clean aesthetic, negative space, flat lay, professional product photography, premium quality, high contrast",
        "vibrant": "Vibrant colors, saturated tones, modern aesthetic, trending on Instagram, eye-catching composition, professional lighting, editorial design"
    }
    
    base_enhancement = style_keywords.get(style, style_keywords["photorealistic"])
    
    # Add anti-AI generation prompts
    enhanced = f"{prompt}. {base_enhancement}. Photo should look like real professional photography, not AI-generated. Realistic texture, natural imperfections, authentic details, high quality professional photo."
    
    return enhanced

async def generate_instagram_image(description: str, style: str, aspect_ratio: str, model: str) -> str:
    """Generate Instagram-optimized images with realistic appearance."""
    
    # Map aspect ratios to sizes for better results
    aspect_map = {
        "1:1": "1:1",      # Square for feed
        "4:5": "4:5",      # Portrait for feed
        "9:16": "9:16"     # Story format
    }
    
    aspect = aspect_map.get(aspect_ratio, "1:1")
    
    # Enhance the prompt for realism
    enhanced_prompt = enhance_prompt_for_realism(description, style)
    
    try:
        if model == "dalle":
            url = await dalle_generate(enhanced_prompt)
        else:
            # Flux prioritized for high-quality results
            url = await flux_generate(enhanced_prompt)
        
        if not url or "error" in str(url).lower():
            # Fallback to DALLE if Flux fails
            url = await dalle_generate(enhanced_prompt)
            
        if not url or "error" in str(url).lower():
            raise HTTPException(status_code=500, detail="Image generation failed after fallbacks")
            
        return url
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate")
async def generate_image_endpoint(req: ImageRequest, user: dict = Depends(get_current_user)):
    """Generate an image based on a prompt."""
    try:
        if req.model == "dalle":
            url = await dalle_generate(req.prompt)
        else:
            # Flux is prioritized for high-end results
            url = await flux_generate(req.prompt)
        
        if "error" in str(url).lower():
            raise HTTPException(status_code=500, detail=str(url))
            
        return {"status": "success", "url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-instagram")
async def generate_instagram_image_endpoint(req: InstagramImageRequest, user: dict = Depends(get_current_user)):
    """Generate realistic Instagram images that don't look AI-generated."""
    try:
        url = await generate_instagram_image(
            description=req.product_description,
            style=req.style,
            aspect_ratio=req.aspect_ratio,
            model=req.model
        )
        
        if not url:
            raise HTTPException(status_code=500, detail="Failed to generate Instagram image")
            
        return {"status": "success", "url": url, "style": req.style, "aspect_ratio": req.aspect_ratio}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
