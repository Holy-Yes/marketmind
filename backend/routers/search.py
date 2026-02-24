from fastapi import APIRouter, Depends, HTTPException, Query
from auth import get_current_user
from ai_clients import SERPAPI_KEY
import httpx

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/")
async def search_web(q: str = Query(...), user: dict = Depends(get_current_user)):
    """
    Backend proxy for SerpAPI to avoid CORS issues on the frontend.
    """
    if not SERPAPI_KEY:
        raise HTTPException(status_code=500, detail="SERPAPI_KEY not configured on server")
    
    try:
        # Forward the search request to SerpAPI using async httpx
        params = {
            "q": q,
            "api_key": SERPAPI_KEY,
            "num": 5
        }
        async with httpx.AsyncClient() as client:
            r = await client.get("https://serpapi.com/search.json", params=params, timeout=10.0)
        
        if r.status_code != 200:
            return {"success": False, "error": f"SerpAPI returned status {r.status_code}"}
        
        data = r.json()
        organic_results = data.get("organic_results", [])
        
        # Format the same way the frontend expected
        formatted_results = [
            {
                "title": res.get("title"),
                "snippet": res.get("snippet"),
                "link": res.get("link")
            }
            for res in organic_results
        ]
        
        return {"success": True, "data": formatted_results}
        
    except Exception as e:
        print(f"❌ [Backend Search Proxy] Error: {e}")
        return {"success": False, "error": str(e)}
