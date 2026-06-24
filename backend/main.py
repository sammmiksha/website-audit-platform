import json
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, get_db, Base
from models import AuditReport
from schemas import AuditRequest, AuditReportBrief, AuditReportResponse
from crawler.engine import AuditEngine

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Website Audit Platform API")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local dev, allow all. In production, restrict this.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

audit_engine = AuditEngine()

@app.post("/api/audit", response_model=AuditReportResponse, status_code=status.HTTP_201_CREATED)
def trigger_audit(request: AuditRequest, db: Session = Depends(get_db)):
    """
    Triggers a live audit for the specified URL, saves the result to SQLite, and returns it.
    """
    url_str = request.url.strip()
    if not url_str:
        raise HTTPException(status_code=400, detail="URL cannot be empty.")

    # Execute the audit synchronously (since V1 demands immediate report display)
    result = audit_engine.run_audit(url_str)

    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=result.get("error_message", "Unable to access website.")
        )

    # Save to database
    try:
        report = AuditReport(
            url=result["url"],
            domain=result["domain"],
            created_at=result["created_at"],
            completed_at=result["completed_at"],
            duration=result["duration"],
            crawler_type=result["crawler_type"],
            score_overall=result["score_overall"],
            score_technical=result["score_technical"],
            score_seo=result["score_seo"],
            score_accessibility=result["score_accessibility"],
            score_mobile=result["score_mobile"],
            details_json=json.dumps(result["details"])
        )
        db.add(report)
        db.commit()
        db.refresh(report)

        # Build response with details parsed back into dict
        response_data = AuditReportResponse.model_validate(report)
        response_data.details = result["details"]
        return response_data

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database storage failed: {str(e)}"
        )

@app.get("/api/audits", response_model=List[AuditReportBrief])
def list_audits(db: Session = Depends(get_db)):
    """
    Returns historical audit runs (metadata only, for fast history views).
    """
    reports = db.query(AuditReport).order_by(AuditReport.created_at.desc()).all()
    return reports

@app.get("/api/audits/{audit_id}", response_model=AuditReportResponse)
def get_audit(audit_id: int, db: Session = Depends(get_db)):
    """
    Returns full details for a specific audit.
    """
    report = db.query(AuditReport).filter(AuditReport.id == audit_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Audit report not found.")

    response_data = AuditReportResponse.model_validate(report)
    if report.details_json:
        try:
            response_data.details = json.loads(report.details_json)
        except Exception:
            response_data.details = {}
    return response_data

@app.delete("/api/audits/{audit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_audit(audit_id: int, db: Session = Depends(get_db)):
    """
    Deletes an audit report.
    """
    report = db.query(AuditReport).filter(AuditReport.id == audit_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Audit report not found.")
    
    try:
        db.delete(report)
        db.commit()
        return
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete audit: {str(e)}"
        )
