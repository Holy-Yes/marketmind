"""
Module 8 — Product Management (Client Portfolio)
"""
from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user
from models import ProductCreateRequest
import uuid

router = APIRouter(prefix="/products", tags=["products"])

# In-memory store (replace with DB for production)
_product_store: list[dict] = [
    {
        "id": "prod_1",
        "name": "MarketMind Pro",
        "description": "Enterprise-grade marketing intelligence platform with real-time grounding.",
        "category": "SaaS",
        "price": 499.0,
        "sales_volume": 1250,
        "workspace_id": "default"
    },
    {
        "id": "prod_2",
        "name": "Campaign Automator",
        "description": "AI-driven tool for multi-platform ad campaign generation.",
        "category": "SaaS",
        "price": 199.0,
        "sales_volume": 3400,
        "workspace_id": "default"
    }
]

@router.post("/")
async def create_product(req: ProductCreateRequest, user: dict = Depends(get_current_user)):
    product = {
        "id": f"prod_{uuid.uuid4().hex[:8]}",
        **req.model_dump(),
        "workspace_id": user.get("workspace_id", "default")
    }
    _product_store.append(product)
    return {"status": "created", "product": product}

@router.get("/")
async def list_products(user: dict = Depends(get_current_user)):
    workspace_id = user.get("workspace_id", "default")
    return [p for p in _product_store if p.get("workspace_id") == workspace_id]

@router.delete("/{product_id}")
async def delete_product(product_id: str, user: dict = Depends(get_current_user)):
    global _product_store
    workspace_id = user.get("workspace_id", "default")
    
    initial_len = len(_product_store)
    _product_store = [p for p in _product_store if not (p["id"] == product_id and p["workspace_id"] == workspace_id)]
    
    if len(_product_store) == initial_len:
        raise HTTPException(status_code=404, detail="Product not found or unauthorized")
        
    return {"status": "deleted", "id": product_id}

# Helper for competitor router
def get_product_by_id(product_id: str, workspace_id: str):
    for p in _product_store:
        if p["id"] == product_id and p["workspace_id"] == workspace_id:
            return p
    return None
