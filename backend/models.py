"""
Pydantic request/response models for all API endpoints.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List


# ─── Auth ────────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    email: str
    name: str
    role: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ─── Campaign / Content ───────────────────────────────────────────────────────
class CampaignRequest(BaseModel):
    product_description: str
    goal: str = "awareness"
    platform: str = "instagram"
    tone: str = "professional"
    brand_voice: Optional[str] = None
    visual_style: Optional[str] = "photorealistic"
    model: Optional[str] = None


# ─── Instagram ────────────────────────────────────────────────────────────────
class InstagramRequest(BaseModel):
    product_description: str
    mode: str = "post"  # "post" | "reel"
    visual_style: str = "Bold"
    goal: str = "awareness"
    model: Optional[str] = None


# ─── Pitch / Email ────────────────────────────────────────────────────────────
class ColdEmailRequest(BaseModel):
    prospect_name: str
    company: str
    role: str
    trigger_event: Optional[str] = None
    framework: str = "auto"  # AIDA, PAS, STAR, Challenger, auto
    model: Optional[str] = None


class SalesPitchRequest(BaseModel):
    product_description: str
    prospect_company: str
    meeting_context: Optional[str] = None
    model: Optional[str] = None


class ProposalRequest(BaseModel):
    brief_text: str
    model: Optional[str] = None


# ─── Competitor ────────────────────────────────────────────────────────────────
class CompetitorRequest(BaseModel):
    competitor_name: str
    report_types: Optional[List[str]] = None
    client_product_id: Optional[str] = None  # To compare against a local product
    model: Optional[str] = None


# ─── Products ──────────────────────────────────────────────────────────────────
class ProductCreateRequest(BaseModel):
    name: str
    description: str
    category: Optional[str] = None
    price: Optional[float] = 0.0
    sales_volume: Optional[int] = 0


# ─── Lead Scoring ─────────────────────────────────────────────────────────────
class LeadRequest(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    company_size: Optional[int] = None
    email_opens: Optional[int] = 0
    page_visits: Optional[int] = 0
    notes: Optional[str] = None
    lead_data: Optional[str] = None  # New blob field for pasting CSV/text
    model: Optional[str] = None


# ─── Simulator ────────────────────────────────────────────────────────────────
class SimulatorStartRequest(BaseModel):
    persona: str


class SimulatorMessageRequest(BaseModel):
    persona: str
    rep_message: str
    history: List[dict] = []
    model: Optional[str] = None


class SimulatorDebriefRequest(BaseModel):
    persona: str
    transcript: List[dict]


# ─── Intelligence ─────────────────────────────────────────────────────────────
class IntelligenceRequest(BaseModel):
    period: str = "this_week"
    report_type: Optional[str] = None
    focus_area: Optional[str] = None
    model: Optional[str] = None


# ─── Outcome Memory ───────────────────────────────────────────────────────────
class OutcomeLogRequest(BaseModel):
    module: str
    action_type: str
    content_snippet: Optional[str] = None
    outcome: Optional[str] = None
    rating: Optional[int] = None
