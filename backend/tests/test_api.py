import requests
import json
import time

API_BASE = "http://localhost:8000/api"

def test_api():
    print("=== TESTING FASTAPI ENDPOINTS ===")
    
    # 1. Trigger audit via POST /api/audit
    print("\n1. Posting audit request for https://example.com...")
    start_time = time.time()
    try:
        response = requests.post(
            f"{API_BASE}/audit",
            json={"url": "https://example.com"},
            timeout=20
        )
        duration = round(time.time() - start_time, 2)
        print(f"Response code: {response.status_code} (took {duration}s)")
        
        if response.status_code != 201:
            print(f"Failed! Output: {response.text}")
            return
            
        data = response.json()
        report_id = data["id"]
        print(f"Audit created successfully! Report ID: {report_id}")
        print(f"Domain: {data['domain']}, Score: {data['score_overall']}")
        
    except Exception as e:
        print(f"API request failed: {str(e)}")
        return

    # 2. Get history list via GET /api/audits
    print("\n2. Fetching historical audit reports...")
    try:
        response = requests.get(f"{API_BASE}/audits")
        print(f"Response code: {response.status_code}")
        history = response.json()
        print(f"Found {len(history)} historical audit(s)")
        for item in history:
            print(f"  - ID: {item['id']}, Domain: {item['domain']}, Score: {item['score_overall']}")
    except Exception as e:
        print(f"API history request failed: {str(e)}")

    # 3. Get detailed report via GET /api/audits/{id}
    print(f"\n3. Retrieving detailed report for ID: {report_id}...")
    try:
        response = requests.get(f"{API_BASE}/audits/{report_id}")
        print(f"Response code: {response.status_code}")
        report_details = response.json()
        print(f"Retrieved title: {report_details['details']['title']}")
        print(f"Recommendations count (SEO): {len(report_details['details']['recommendations']['seo'])}")
    except Exception as e:
        print(f"API detail request failed: {str(e)}")

    # 4. Delete report via DELETE /api/audits/{id}
    print(f"\n4. Deleting audit report with ID: {report_id}...")
    try:
        response = requests.delete(f"{API_BASE}/audits/{report_id}")
        print(f"Response code: {response.status_code} (Expected 244/204)")
        
        # Verify it's gone
        check_resp = requests.get(f"{API_BASE}/audits/{report_id}")
        print(f"Verify status after deletion: {check_resp.status_code} (Expected 404)")
    except Exception as e:
        print(f"API delete request failed: {str(e)}")

if __name__ == "__main__":
    # Give uvicorn a second to make sure it's fully up if needed, though it's already running
    test_api()
