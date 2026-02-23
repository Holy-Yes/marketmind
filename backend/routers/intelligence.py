"""
Module 7 — Business Intelligence & Weekly Brief (Gemini)
"""
from fastapi import APIRouter, Depends
from auth import get_current_user
from models import IntelligenceRequest
from ai_clients import unified_generate

router = APIRouter(prefix="/intelligence", tags=["intelligence"])

BRIEF_PROMPT = """Generate a MarketMind Weekly Intelligence Brief for a small business owner.

STRICT FORMATTING RULES:
1. Use **BOLD** for all significant metrics, names, and key insights.
2. Use clear, bulleted lists for all analytical points.
3. Every section MUST provide actionable "Tactical Steps".

## 🚀 Monday Morning Brief
### The Lead Insight
- Start with the single most critical trend or signal detected this week.
- Explain the **immediate impact** on revenue or growth.

### Market Shift Analysis
- List 3 specific changes in the market landscape.
- Compare these against the client's current positioning.

### 📈 Lead & Pipeline Health
- Summary of lead quality vs volume this week.
- Identify the **top-performing channel** and why it's winning.

### 💡 The Counter-Intuitive Move
- One recommendation that goes against standard industry advice.
- Provide a clear **"Why it works"** justification.

## 🎯 Top Opportunity This Week
- EXHAUSTIVE breakdown of the single biggest growth opportunity right now.
- Include 3 specific steps to capture it today.

## 🔗 Competitor Alerts & Movements
- **[Competitor Name]**: Specific movement detected + Tactical response.
- **[Competitor Name]**: Specific movement detected + Tactical response.

## ✅ Priority Action Items
1. **[Action Item]**: Who handles it + Expected ROI.
2. **[Action Item]**: Who handles it + Expected ROI.
"""

@router.post("/weekly-brief")
async def generate_weekly_brief(req: IntelligenceRequest, user: dict = Depends(get_current_user)):
    content = await unified_generate(BRIEF_PROMPT, model_name=req.model)
    return {
        "status": "complete",
        "period": req.period,
        "content": content,
        "model": req.model or "gemini-1.5-pro",
        "generated_at": "2026-02-23T12:00:00Z",
        "why_this": [
            {"rule": "Monday brief cadence — highest executive engagement rate", "confidence": 94, "outcomes": 61},
            {"rule": "Revenue forecast calibrated to your sector and stage", "confidence": 79, "outcomes": 28},
        ]
    }


@router.get("/dashboard-stats")
async def get_dashboard_stats(user: dict = Depends(get_current_user)):
    """Return dashboard overview metrics (demo data + AI insight)."""
    return {
        "stats": [
            {"label": "Hot Leads", "value": "1,284", "change": "+12.5%", "positive": True},
            {"label": "Conv. Rate", "value": "4.82%", "change": "+2.1%", "positive": True},
            {"label": "Active Campaigns", "value": "24", "change": "0.0%", "positive": None},
            {"label": "Pipeline Value", "value": "₹4.2M", "change": "+8.4%", "positive": True},
        ],
        "chart_data": [60, 45, 75, 55, 90, 40, 65, 80, 50, 70, 85, 95],
        "top_leads": [
            {"name": "Kunal Singh", "company": "Zomato", "score": 98, "role": "VP Growth"},
            {"name": "Sarah Ahmed", "company": "Nykaa", "score": 94, "role": "CMO"},
            {"name": "Vikram Patel", "company": "Swiggy", "score": 89, "role": "Head of Sales"},
        ]
    }


@router.get("/opportunity-alerts")
async def get_opportunity_alerts(user: dict = Depends(get_current_user)):
    return {
        "alerts": [
            {
                "id": 1, "urgency": "high", "type": "Market Trend",
                "title": "Instagram Reels engagement up 34% in your niche",
                "action": "Schedule 2 more Reels this week",
                "generated_at": "2026-02-23T08:00:00Z"
            },
            {
                "id": 2, "urgency": "medium", "type": "Competitor Move",
                "title": "Competitor dropped Starter plan price by ₹500",
                "action": "Send proactive pricing comms to Warm-tier leads",
                "generated_at": "2026-02-23T07:30:00Z"
            },
            {
                "id": 3, "urgency": "low", "type": "Lead Signal",
                "title": "23 leads moved to Hot tier after email campaign",
                "action": "Begin sales outreach sequence for these 23 leads",
                "generated_at": "2026-02-23T06:00:00Z"
            }
        ]
    }
