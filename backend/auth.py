"""
MarketMind — Auth Module
JWT-based authentication with bcrypt password hashing and RBAC.
"""
import os
import uuid
import bcrypt as _bcrypt
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Load from env, fallback for dev
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "marketmind-dev-secret-key-change-in-production-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# In-memory user store (replace with DB in production)
_users_db: dict[str, dict] = {}


def _hash_password(plain: str) -> str:
    return _bcrypt.hashpw(plain.encode(), _bcrypt.gensalt()).decode()


def _verify_password(plain: str, hashed: str) -> bool:
    return _bcrypt.checkpw(plain.encode(), hashed.encode())


def _seed_demo_user():
    """Pre-seed a demo user so the app works out of the box."""
    demo_email = "demo@marketmind.ai"
    # Pre-computed bcrypt hash for "demo1234"
    demo_hash = "$2b$12$qMvuDPeaBDq7laEn1KnJtuuKlSTDjgAnkvPRN4ckozJpGRmEZRZli"
    _users_db[demo_email] = {
        "email": demo_email,
        "name": "Demo User",
        "hashed_password": demo_hash,
        "role": "admin",
        "workspace_id": "demo-workspace-001",
        "created_at": datetime.utcnow().isoformat(),
    }


# Seed on module load
_seed_demo_user()


def register_user(email: str, password: str, name: str) -> dict:
    if email.lower() in _users_db:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    user = {
        "email": email.lower(),
        "name": name,
        "hashed_password": _hash_password(password),
        "role": "admin",
        "workspace_id": str(uuid.uuid4()),
        "created_at": datetime.utcnow().isoformat(),
    }
    _users_db[email.lower()] = user
    return user


def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = _users_db.get(email.lower())
    if not user:
        return None
    if not _verify_password(password, user["hashed_password"]):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = _users_db.get(email.lower())
    if not user:
        raise credentials_exception
    return user
