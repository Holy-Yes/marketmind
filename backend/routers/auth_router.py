"""
Auth Router — Register, Login, Profile endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException
from auth import (
    register_user, authenticate_user, create_access_token, get_current_user
)
from models import RegisterRequest, LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest):
    user = register_user(email=req.email, password=req.password, name=req.name)
    token = create_access_token({"sub": user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"email": user["email"], "name": user["name"], "role": user["role"]}
    }


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    user = authenticate_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"email": user["email"], "name": user["name"], "role": user["role"]}
    }


@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "email": current_user["email"],
        "name": current_user["name"],
        "role": current_user["role"],
        "workspace_id": current_user["workspace_id"],
        "created_at": current_user["created_at"]
    }
