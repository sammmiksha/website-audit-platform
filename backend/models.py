from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from database import Base

class AuditReport(Base):
    __tablename__ = "audit_reports"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    domain = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    duration = Column(Float, default=0.0)  # in seconds
    crawler_type = Column(String, default="static")  # 'static' or 'playwright'
    
    # Category Scores
    score_overall = Column(Integer, default=0)
    score_technical = Column(Integer, default=0)
    score_seo = Column(Integer, default=0)
    score_accessibility = Column(Integer, default=0)
    score_mobile = Column(Integer, default=0)
    
    # Store all structured metadata, headings, images, links, recommendations, strengths in a JSON string
    details_json = Column(Text, nullable=True)
