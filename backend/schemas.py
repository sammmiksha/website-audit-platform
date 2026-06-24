from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional, Dict, Any, List

class AuditRequest(BaseModel):
    url: str

class AuditReportBrief(BaseModel):
    id: int
    url: str
    domain: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    duration: float
    crawler_type: str
    score_overall: int
    score_technical: int
    score_seo: int
    score_accessibility: int
    score_mobile: int

    class Config:
        from_attributes = True

class AuditReportResponse(AuditReportBrief):
    details: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
