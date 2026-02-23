"""
MarketMind — AI Clients Module
Central access point for Gemini, Hugging Face, Groq, and Fal.ai (Flux).
Keys are loaded from .env — the app gracefully degrades if a key is missing.
"""
import os
import asyncio
import requests

# Load keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
HF_API_KEY = os.getenv("HF_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
FAL_KEY = os.getenv("FAL_KEY", "")
SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")

# ──────────────────────────────────────────────────────────────────────────────
# Gemini (Google Generative AI)
# ──────────────────────────────────────────────────────────────────────────────
_gemini_client = None

def _get_gemini():
    global _gemini_client
    if _gemini_client is None:
        if not GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY not set in .env file")
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        _gemini_client = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            generation_config={"temperature": 0.85, "max_output_tokens": 4096},
        )
    return _gemini_client

async def gemini_generate(prompt: str) -> str:
    """Generate a response from Gemini 1.5 Flash (Non-blocking) with retry."""
    try:
        model = _get_gemini()
        # Use to_thread for blocking genai call
        response = await asyncio.to_thread(model.generate_content, prompt)
        return response.text
    except Exception as e:
        err_str = str(e)
        print(f"   ⚠️ [DEBUG] Gemini Exception caught: {err_str[:100]}...")
        if any(x in err_str.upper() for x in ["429", "QUOTA", "RESOURCE_EXHAUSTED", "LIMIT_EXCEEDED"]):
            print(f"   ⚠️ Gemini Quota Reached. Signaling fallback to Groq...")
            return "__FALLBACK_TRIGGERED__"
        return f"⚠️ Gemini error: {e}"

# ──────────────────────────────────────────────────────────────────────────────
# Hugging Face (Inference API)
# ──────────────────────────────────────────────────────────────────────────────
async def huggingface_generate(prompt: str, model: str = "mistralai/Mistral-7B-Instruct-v0.3") -> str:
    """Generate a response via Hugging Face Inference API."""
    try:
        if not HF_API_KEY:
            return None
        
        API_URL = f"https://router.huggingface.co/models/{model}"
        headers = {"Authorization": f"Bearer {HF_API_KEY}"}
        
        payload = {
            "inputs": f"<s>[INST] {prompt} [/INST]",
            "parameters": {"max_new_tokens": 1024, "temperature": 0.7}
        }
        
        response = requests.post(API_URL, headers=headers, json=payload, timeout=20)
        if response.status_code != 200:
            return None 

        result = response.json()
        if isinstance(result, list) and len(result) > 0 and "generated_text" in result[0]:
            full_text = result[0]["generated_text"]
            if "[/INST]" in full_text:
                return full_text.split("[/INST]")[-1].strip()
            return full_text
        return None
    except Exception:
        return None

# ──────────────────────────────────────────────────────────────────────────────
# Groq (LLaMA 3.1 70B, Mixtral)
# ──────────────────────────────────────────────────────────────────────────────
_groq_client = None

def _get_groq():
    global _groq_client
    if _groq_client is None:
        if not GROQ_API_KEY:
            raise RuntimeError("GROQ_API_KEY not set in .env file")
        from groq import Groq
        _groq_client = Groq(api_key=GROQ_API_KEY)
    return _groq_client

async def groq_generate(prompt: str, model: str = "llama-3.3-70b-versatile", system: str = "You are a helpful AI assistant.") -> str:
    """Generate a response from Groq."""
    try:
        client = _get_groq()
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2048,
            temperature=0.85,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"⚠️ Groq error: {e}"

# ──────────────────────────────────────────────────────────────────────────────
# Unified Generation Hub
# ──────────────────────────────────────────────────────────────────────────────
async def unified_generate(prompt: str, model_name: str = "groq", system: str = "You are MarketMind's expert marketing intelligence AI.") -> str:
    """Route prompts to the requested model. Defaults to Groq (Stable) per user preference."""
    m = model_name.lower()
    
    # Primary: Groq (llama-3.3-70b is extremely fast and stable)
    if "llama" in m or "groq" in m or "stable" in m or model_name == "groq":
        try: 
            return await groq_generate(prompt, model="llama-3.3-70b-versatile", system=system)
        except Exception as e: 
            print(f"   🔄 [UNIFIED] Groq failed ({e}), falling back to Gemini...")
            return await gemini_generate(prompt)

    # Secondary: Gemini (fallback or explicit request)
    res = await gemini_generate(prompt)
    if res == "__FALLBACK_TRIGGERED__":
        print("   🔄 [UNIFIED] Gemini exhausted. Attempting Groq fallback...")
        try:
            return await groq_generate(prompt, model="llama-3.3-70b-versatile", system=system)
        except:
            return "⚠️ Multi-Model Quota Exceeded. Please wait a moment."
    
    return res

# ──────────────────────────────────────────────────────────────────────────────
# Image Generation: DALL-E & Fal.ai (Flux)
# ──────────────────────────────────────────────────────────────────────────────
_openai_client = None

def _get_openai():
    global _openai_client
    if _openai_client is None:
        if not OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY not set in .env file")
        from openai import AsyncOpenAI
        _openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    return _openai_client

async def dalle_generate(prompt: str, size: str = "1024x1024") -> str:
    """Generate an image URL from DALL-E 3."""
    try:
        if not OPENAI_API_KEY or OPENAI_API_KEY.startswith("sk-proj-") and "placeholder" in OPENAI_API_KEY:
            print(f"   ⚠️ DALLE: OpenAI API key not configured or is placeholder")
            return None
        
        client = _get_openai()
        print(f"   📡 [DALLE] Calling OpenAI with prompt: {prompt[:50]}...")
        response = await client.images.generate(
            model="dall-e-3", prompt=prompt, n=1, size=size, quality="standard"
        )
        url = response.data[0].url
        print(f"   ✅ [DALLE] Generated image: {url[:80]}...")
        return url
    except Exception as e:
        print(f"   ❌ [DALLE] Failure: {e}")
        return None

async def unsplash_fallback(prompt: str) -> str:
    """Fetch a relevant image from Unsplash public API (no auth required)."""
    try:
        print(f"   📡 [UNSPLASH] Fetching image for: {prompt[:50]}...")
        
        # Extract key words from prompt
        search_query = prompt.split()[0] if prompt else "modern"
        
        r = requests.get(
            "https://api.unsplash.com/search/photos",
            params={"query": search_query, "per_page": 1, "client_id": "demo"},  # Using demo client
            timeout=10
        )
        
        if r.status_code == 200:
            data = r.json()
            if data.get("results") and len(data["results"]) > 0:
                url = data["results"][0]["urls"]["regular"]
                print(f"   ✅ [UNSPLASH] Got image: {url[:80]}...")
                return url
        
        print(f"   ⚠️ [UNSPLASH] No results or API limit, using placeholder")
        return None
    except Exception as e:
        print(f"   ⚠️ [UNSPLASH] Error: {e}")
        return None

async def placeholder_image(prompt: str) -> str:
    """Generate a placeholder image using DiceBear API (no auth, no rate limits)."""
    try:
        print(f"   📡 [PLACEHOLDER] Generating placeholder for: {prompt[:30]}...")
        
        # Use a deterministic seed based on prompt
        import hashlib
        seed = hashlib.md5(prompt.encode()).hexdigest()[:8]
        
        # DiceBear offers multiple avatar styles - we'll use "pixel-art" for Instagram vibes
        url = f"https://api.dicebear.com/8.x/luna/png?seed={seed}&scale=120&backgroundColor=random"
        
        print(f"   ✅ [PLACEHOLDER] Generated URL: {url}")
        return url
    except Exception as e:
        print(f"   ❌ [PLACEHOLDER] Error: {e}")
        return None

async def pollinations_generate(prompt: str) -> str:
    """Generate a free AI image from Pollinations.ai (no key required)."""
    try:
        import urllib.parse
        print(f"   📡 [POLLINATIONS] Generating free AI image for: {prompt[:50]}...")
        
        # Clean prompt for URL
        clean_prompt = urllib.parse.quote(prompt)
        
        # Construct URL with some quality parameters
        url = f"https://image.pollinations.ai/prompt/{clean_prompt}?width=1024&height=1024&nologo=true&enhance=true"
        
        # Verify URL is reachable (optional, Pollinations is quite stable)
        return url
    except Exception as e:
        print(f"   ⚠️ [POLLINATIONS] Error: {e}")
        return None

async def flux_generate(prompt: str) -> str:
    """Generate a high-end image from Fal.ai (Flux.1) with multiple fallbacks."""
    try:
        if not FAL_KEY:
            print(f"   ⚠️ Flux: FAL_KEY not set")
            raise Exception("FAL_KEY not configured")
        
        print(f"   📡 [FLUX] Starting Flux image generation...")
        os.environ["FAL_KEY"] = FAL_KEY  # Ensure FAL_KEY is in environment
        
        def _flux_submit():
            import fal_client
            print(f"   📡 [FLUX] Submitting to fal-ai/flux/schnell...")
            
            # Use sync submit (blocking but works reliably)
            handler = fal_client.submit(
                "fal-ai/flux/schnell",
                arguments={"prompt": prompt, "image_size": "landscape_4_3"}
            )
            print(f"   ⏳ [FLUX] Waiting for result...")
            result = handler.get()
            
            if result and "images" in result and len(result["images"]) > 0:
                url = result["images"][0]["url"]
                print(f"   ✅ [FLUX] Generated image: {url[:80]}...")
                return url
            else:
                print(f"   ⚠️ [FLUX] No images in result: {result}")
                raise Exception("No images in Flux response")
        
        # Run the blocking operation in a thread pool
        url = await asyncio.to_thread(_flux_submit)
        return url
            
    except Exception as e:
        print(f"   ❌ [FLUX] Error: {e}")
        
        # Fallback 2: Try Pollinations (Free Generative - HIGH PRIORITY FALLBACK)
        try:
            print(f"   🔄 [FLUX] Trying Pollinations free generative fallback...")
            p_url = await pollinations_generate(prompt)
            if p_url:
                return p_url
        except Exception as p_err:
            print(f"   ⚠️ [POLLINATIONS] Fallback failed: {p_err}")

        # Fallback 3: Try DALL-E
        try:
            print(f"   🔄 [FLUX] Trying DALLE fallback...")
            dalle_url = await dalle_generate(prompt)
            if dalle_url:
                return dalle_url
        except Exception as dalle_err:
            print(f"   ⚠️ [DALLE] Fallback failed: {dalle_err}")
        
        # Fallback 4: Try Unsplash
        try:
            print(f"   🔄 [FLUX] Trying Unsplash fallback...")
            unsplash_url = await unsplash_fallback(prompt)
            if unsplash_url:
                return unsplash_url
        except Exception as unsplash_err:
            print(f"   ⚠️ [UNSPLASH] Fallback failed: {unsplash_err}")
        
        # Fallback 3: Use placeholder
        try:
            print(f"   🔄 [FLUX] Trying placeholder fallback...")
            placeholder_url = await placeholder_image(prompt)
            if placeholder_url:
                return placeholder_url
        except Exception as placeholder_err:
            print(f"   ⚠️ [PLACEHOLDER] Fallback failed: {placeholder_err}")
        
        print(f"   ❌ All image generation methods failed for prompt: {prompt[:100]}...")
        # Final absolute fallback to a reliable photo placeholder
        return f"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1024"
