"""
Outcome Memory Engine — Logs generation→action→outcome chains.
Returns enriched Why This panel data.
"""
from fastapi import APIRouter, Depends
from auth import get_current_user
from models import OutcomeLogRequest
from collections import defaultdict

router = APIRouter(prefix="/memory", tags=["outcome-memory"])

# In-memory store (replace with ChromaDB/Pinecone in production)
_memory_store: list[dict] = []
_rules_cache: dict[str, list] = {}


def _derive_rules(workspace_id: str) -> list[dict]:
    """Derive Outcome Memory rules from logged outcomes for a workspace."""
    workspace_outcomes = [m for m in _memory_store if m.get("workspace_id") == workspace_id]

    if not workspace_outcomes:
        return []

    # Simple pattern detection (in production: ML clustering)
    module_counts = defaultdict(lambda: defaultdict(int))
    for outcome in workspace_outcomes:
        module_counts[outcome["module"]][outcome["action_type"]] += 1

    rules = []
    for module, actions in module_counts.items():
        for action, count in actions.items():
            if count >= 2:
                confidence = min(60 + (count * 5), 97)
                rules.append({
                    "rule": f"{action.replace('_', ' ').title()} on {module} generates higher engagement",
                    "module": module,
                    "confidence": confidence,
                    "outcomes": count,
                    "created_at": "2026-02-20T10:00:00Z"
                })

    return sorted(rules, key=lambda x: -x["confidence"])[:3]


@router.post("/log")
async def log_outcome(req: OutcomeLogRequest, user: dict = Depends(get_current_user)):
    """Log a generation outcome to the memory engine."""
    entry = {
        **req.model_dump(),
        "workspace_id": user.get("workspace_id"),
        "logged_at": "2026-02-23T12:00:00Z"
    }
    _memory_store.append(entry)
    return {"status": "logged", "rule_count": len(_derive_rules(user.get("workspace_id", "")))}


@router.get("/rules")
async def get_rules(user: dict = Depends(get_current_user)):
    """Get active Outcome Memory rules for the current workspace."""
    workspace_id = user.get("workspace_id", "")
    rules = _derive_rules(workspace_id)
    outcomes_count = len([m for m in _memory_store if m.get("workspace_id") == workspace_id])
    return {
        "rules": rules,
        "total_outcomes": outcomes_count,
        "rules_active": len(rules),
        "next_rule_at": max(0, 5 - outcomes_count),
        "status": "active" if rules else "learning"
    }


@router.get("/status")
async def get_memory_status(user: dict = Depends(get_current_user)):
    workspace_id = user.get("workspace_id", "")
    outcomes = len([m for m in _memory_store if m.get("workspace_id") == workspace_id])
    rules = _derive_rules(workspace_id)
    return {
        "outcomes_logged": outcomes,
        "rules_active": len(rules),
        "progress_to_first_rule": min(outcomes / 5 * 100, 100),
        "status": "active" if rules else ("learning" if outcomes > 0 else "empty")
    }
