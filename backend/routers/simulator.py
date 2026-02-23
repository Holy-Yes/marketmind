"""
Module 6 — Sales Practice Simulator (Groq LLaMA 3.1 70B streaming, <500ms responses)
"""
import asyncio
import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from auth import get_current_user
from models import SimulatorStartRequest, SimulatorMessageRequest, SimulatorDebriefRequest
from ai_clients import unified_generate

router = APIRouter(prefix="/simulator", tags=["simulator"])

PERSONAS = {
    "Skeptical CFO": {
        "name": "Rajesh Malhotra",
        "role": "CFO",
        "company": "Mid-size manufacturing company",
        "style": "data-driven, sceptical of buzzwords, focused on ROI and payback period, resistant to change",
        "difficulty": "Expert",
        "avatar_color": "#DC2626"
    },
    "Curious SMB Owner": {
        "name": "Priya Sharma",
        "role": "Founder & CEO",
        "company": "Online boutique D2C brand",
        "style": "curious but busy, needs quick wins, price-sensitive, wants to see results before committing",
        "difficulty": "Beginner",
        "avatar_color": "#059669"
    },
    "Analytical CMO": {
        "name": "Arjun Nair",
        "role": "Chief Marketing Officer",
        "company": "Series B SaaS startup",
        "style": "analytical, asks detailed questions, wants integrations and compliance guarantees, knows competitors well",
        "difficulty": "Intermediate",
        "avatar_color": "#2F80ED"
    },
    "Budget-Constrained Startup": {
        "name": "Sneha Gupta",
        "role": "Co-Founder",
        "company": "Pre-seed edtech startup",
        "style": "enthusiastic but strapped for cash, needs to justify every rupee, asks about free trials and refunds",
        "difficulty": "Beginner",
        "avatar_color": "#D97706"
    },
    "Enterprise IT Gatekeeper": {
        "name": "Vikram Iyer",
        "role": "Head of IT & Security",
        "company": "Large BFSI enterprise",
        "style": "security-obsessed, wants compliance reports, asks about data residency and vendor risk",
        "difficulty": "Expert",
        "avatar_color": "#7C3AED"
    },
}

SIMULATOR_SYSTEM = """You are roleplaying as {name}, a {role} at a {company}. 
Your personality: {style}
The sales rep is pitching MarketMind — an AI marketing intelligence platform for SMBs.

Rules:
- Stay completely in character at all times
- Raise at least one relevant objection per exchange
- Escalate scepticism if the rep gives a weak answer
- Give buying signals (interest, questions about pricing/timeline) if the rep gives excellent answers
- Keep responses to 3-5 sentences maximum for conversation flow
- Never break character or mention you are an AI
- Respond in a natural, conversational tone appropriate for a business meeting
"""

DEBRIEF_PROMPT = """Analyse this sales practice session and provide a detailed debrief:
Product pitched: MarketMind
Persona: {persona}
Transcript:
{transcript}

## Session Score (0-100)
Score and brief justification.

## Objection Handling Assessment
List each objection raised and rate how well it was handled (Good/Fair/Poor) with specific improvement.

## Communication Strengths (3 bullets)
What the rep did well.

## Areas for Improvement (3 bullets)
Specific, actionable improvements with example language.

## Filler Word Analysis
Count and list filler phrases if any are visible in the transcript.

## Overall Recommendation
One paragraph of direct coaching advice.
"""

@router.get("/personas")
async def get_personas():
    return {"personas": [
        {**v, "persona_key": k}
        for k, v in PERSONAS.items()
    ]}


@router.post("/message")
async def send_message(req: SimulatorMessageRequest, user: dict = Depends(get_current_user)):
    persona_data = PERSONAS.get(req.persona, PERSONAS["Skeptical CFO"])
    system = SIMULATOR_SYSTEM.format(**persona_data)

    # Build conversation context
    history_text = ""
    for msg in req.history[-10:]:  # last 10 messages
        role_label = "Sales Rep" if msg["role"] == "rep" else persona_data["name"]
        history_text += f"{role_label}: {msg['content']}\n"

    prompt = f"""Conversation so far:
{history_text}

Sales Rep: {req.rep_message}

{persona_data['name']}:"""

    response = await unified_generate(prompt, model_name=req.model or "groq", system=system)
    return {
        "status": "complete",
        "persona_response": response,
        "persona": req.persona,
        "persona_name": persona_data["name"],
    }


@router.post("/debrief")
async def generate_debrief(req: SimulatorDebriefRequest, user: dict = Depends(get_current_user)):
    transcript_text = "\n".join(
        [f"{'Rep' if m['role'] == 'rep' else 'Customer'}: {m['content']}" for m in req.transcript]
    )
    prompt = DEBRIEF_PROMPT.format(persona=req.persona, transcript=transcript_text)
    content = await unified_generate(prompt, model_name=req.model)
    return {"status": "complete", "debrief": content}
