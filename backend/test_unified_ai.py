import os
import asyncio
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env
load_dotenv(override=True)

async def test_gemini_15_flash():
    print("\n--- Testing Model: gemini-1.5-flash ---")
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ Error: GEMINI_API_KEY not found in .env")
        return

    print(f"Using Key: {api_key[:8]}...{api_key[-4:]}")
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = await asyncio.to_thread(model.generate_content, "Say '1.5 Flash is working.'")
        print(f"✅ gemini-1.5-flash Response: {response.text}")
    except Exception as e:
        print(f"❌ gemini-1.5-flash Failed: {e}")
        if "429" in str(e) or "QUOTA" in str(e).upper():
            print("   ⚠️ gemini-1.5-flash is ALSO RATE LIMITED.")

if __name__ == "__main__":
    asyncio.run(test_gemini_15_flash())
