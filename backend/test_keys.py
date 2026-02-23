import os
import asyncio
from dotenv import load_dotenv

# Force reload .env
load_dotenv(override=True)

async def test_keys():
    fal_key = os.getenv("FAL_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    print(f"FAL_KEY starts with: {fal_key[:10] if fal_key else 'NONE'}")
    print(f"OPENAI_KEY starts with: {openai_key[:10] if openai_key else 'NONE'}")
    
    # Test Flux
    try:
        import fal_client
        print("\n--- Testing Flux ---")
        os.environ["FAL_KEY"] = fal_key
        handler = fal_client.submit(
            "fal-ai/flux/schnell",
            arguments={"prompt": "A professional photo of a coffee cup", "image_size": "landscape_4_3"}
        )
        result = handler.get()
        print(f"✅ Flux Result: {result.get('images', [{}])[0].get('url', 'NO URL')[:60]}...")
    except Exception as e:
        print(f"❌ Flux Failed: {e}")
        
    # Test DALL-E
    try:
        from openai import AsyncOpenAI
        print("\n--- Testing DALL-E ---")
        client = AsyncOpenAI(api_key=openai_key)
        response = await client.images.generate(
            model="dall-e-3", prompt="A professional photo of a coffee cup", n=1, size="1024x1024"
        )
        print(f"✅ DALL-E Result: {response.data[0].url[:60]}...")
    except Exception as e:
        print(f"❌ DALL-E Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_keys())
