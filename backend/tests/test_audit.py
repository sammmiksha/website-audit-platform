import sys
import os
import json

# Ensure parent directory is in search path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from crawler.engine import AuditEngine

def run_test():
    print("Initializing Website Audit Engine...")
    engine = AuditEngine()
    
    test_url = "https://example.com"
    print(f"Starting audit for URL: {test_url}")
    
    result = engine.run_audit(test_url)
    
    if result.get("success", False):
        print("\n=== AUDIT COMPLETED SUCCESSFULY ===")
        print(f"Target URL: {result['url']}")
        print(f"Resolved Domain: {result['domain']}")
        print(f"Crawl Method: {result['crawler_type']}")
        print(f"Duration: {result['duration']} seconds")
        print("\n=== AUDIT SCORES ===")
        print(f"Overall Score:        {result['score_overall']} / 100")
        print(f"Technical Score:      {result['score_technical']} / 100")
        print(f"SEO Score:            {result['score_seo']} / 100")
        print(f"Accessibility Score:  {result['score_accessibility']} / 100")
        print(f"Mobile Responsiveness: {result['score_mobile']} / 100")
        
        print("\n=== WEB PAGE STRUCTURE ===")
        details = result["details"]
        print(f"Page Title: {details['title']}")
        print(f"Meta Description: {details['meta_description']}")
        print(f"Total H1 Headings: {len(details['headings'].get('h1', []))}")
        print(f"Total Images Found: {details['images']['total']} (Missing alt: {details['images']['missing_alt_count']})")
        print(f"Total Internal Links: {details['links']['internal_count']}")
        print(f"Total External Links: {details['links']['external_count']}")
        print(f"Robots.txt Exists: {details['robots_txt_exists']}")
        print(f"Sitemap.xml Exists: {details['sitemap_exists']}")
        
        print("\n=== DETAILED RECOMMENDATIONS ===")
        for cat, recs in details["recommendations"].items():
            if recs:
                print(f"\n[{cat.upper()}] recommendations:")
                for r in recs:
                    print(f"  - {r['title']}: {r['fix']}")
                    
        print("\n=== DETAILED STRENGTHS ===")
        for cat, strs in details["strengths"].items():
            if strs:
                print(f"\n[{cat.upper()}] strengths:")
                for s in strs:
                    print(f"  - {s}")
    else:
        print("\n=== AUDIT FAILED ===")
        print(f"Error Message: {result.get('error_message')}")

if __name__ == "__main__":
    run_test()
