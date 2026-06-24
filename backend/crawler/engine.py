import time
import json
from datetime import datetime
from typing import Dict, Any

from crawler.analyzer import Analyzer
from crawler.scorer import Scorer
from services.technical_service import TechnicalService
from services.seo_service import SeoService
from services.accessibility_service import AccessibilityService
from services.mobile_service import MobileService

class AuditEngine:
    def __init__(self):
        self.analyzer = Analyzer()
        self.scorer = Scorer()
        self.technical_service = TechnicalService()
        self.seo_service = SeoService()
        self.accessibility_service = AccessibilityService()
        self.mobile_service = MobileService()

    def run_audit(self, url: str) -> Dict[str, Any]:
        """
        Runs the complete audit workflow for a given URL.
        """
        started_at = datetime.utcnow()
        start_time = time.time()

        # 1. Analyze and extract content
        extracted_data = self.analyzer.analyze(url)
        
        # If extraction failed, return failure details
        if not extracted_data.get("success", False):
            completed_at = datetime.utcnow()
            duration = round(time.time() - start_time, 2)
            return {
                "success": False,
                "url": url,
                "domain": urlparse_domain(url),
                "created_at": started_at,
                "completed_at": completed_at,
                "duration": duration,
                "crawler_type": "static",
                "error_message": extracted_data.get("error_message", "Unknown error during crawling.")
            }

        # 2. Run Audits
        tech_result = self.technical_service.audit(extracted_data)
        seo_result = self.seo_service.audit(extracted_data)
        access_result = self.accessibility_service.audit(extracted_data)
        mobile_result = self.mobile_service.audit(extracted_data)

        # 3. Score
        score_tech = tech_result["score"]
        score_seo = seo_result["score"]
        score_access = access_result["score"]
        score_mobile = mobile_result["score"]

        score_overall = self.scorer.calculate_overall(
            technical=score_tech,
            seo=score_seo,
            accessibility=score_access,
            mobile=score_mobile
        )

        completed_at = datetime.utcnow()
        duration = round(time.time() - start_time, 2)

        # 4. Consolidate Details JSON
        # Gather all strengths and recommendations across categories
        all_strengths = {
            "technical": tech_result["strengths"],
            "seo": seo_result["strengths"],
            "accessibility": access_result["strengths"],
            "mobile": mobile_result["strengths"]
        }

        all_recommendations = {
            "technical": tech_result["recommendations"],
            "seo": seo_result["recommendations"],
            "accessibility": access_result["recommendations"],
            "mobile": mobile_result["recommendations"]
        }

        details = {
            "title": extracted_data["title"],
            "meta_description": extracted_data["meta_description"],
            "canonical_url": extracted_data["canonical_url"],
            "load_time_seconds": extracted_data["load_time_seconds"],
            "page_size_bytes": extracted_data["page_size_bytes"],
            "crawler_type": extracted_data["crawler_type"],
            "headings": extracted_data["headings"],
            "images": {
                "total": len(extracted_data["images"]),
                "missing_alt_count": sum(1 for img in extracted_data["images"] if img["alt"] is None),
                "list": extracted_data["images"]
            },
            "links": extracted_data["links"],
            "og_tags": extracted_data["og_tags"],
            "robots_txt_exists": extracted_data["robots_txt_exists"],
            "sitemap_exists": extracted_data["sitemap_exists"],
            "stylesheet_count": extracted_data["stylesheet_count"],
            "script_count": extracted_data["script_count"],
            "strengths": all_strengths,
            "recommendations": all_recommendations
        }

        return {
            "success": True,
            "url": extracted_data["url"],
            "domain": extracted_data["domain"],
            "created_at": started_at,
            "completed_at": completed_at,
            "duration": duration,
            "crawler_type": extracted_data["crawler_type"],
            "score_overall": score_overall,
            "score_technical": score_tech,
            "score_seo": score_seo,
            "score_accessibility": score_access,
            "score_mobile": score_mobile,
            "details": details
        }

def urlparse_domain(url: str) -> str:
    from urllib.parse import urlparse
    parsed = urlparse(url)
    if not parsed.scheme:
        parsed = urlparse("https://" + url)
    return parsed.netloc or parsed.path
