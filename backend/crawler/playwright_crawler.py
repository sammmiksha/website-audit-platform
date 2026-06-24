import time
from typing import Dict, Any, Optional

class PlaywrightCrawler:
    def __init__(self, timeout: int = 15):
        self.timeout = timeout

    def crawl(self, url: str) -> Dict[str, Any]:
        """
        Crawls a website using Playwright, rendering any client-side JavaScript.
        """
        result = {
            "url": url,
            "resolved_url": url,
            "status_code": 200,  # Playwright usually resolves successfully if it reaches the page
            "html": "",
            "load_time_seconds": 0.0,
            "page_size_bytes": 0,
            "headers": {},
            "success": False,
            "error": None,
            "crawler_type": "playwright"
        }

        # Normalize URL
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url

        start_time = time.time()
        
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            result["error"] = "playwright package is not installed."
            return result

        try:
            with sync_playwright() as p:
                # Launch headless browser
                browser = p.chromium.launch(headless=True)
                
                # Create a context with desktop-like user agent
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                )
                
                page = context.new_page()
                page.set_default_timeout(self.timeout * 1000)
                
                # Navigate to the website
                response = page.goto(url, wait_until="load")
                
                result["load_time_seconds"] = round(time.time() - start_time, 3)
                
                if response:
                    result["status_code"] = response.status_code
                    result["resolved_url"] = response.url
                    result["headers"] = dict(response.headers)
                    
                    if response.status_code >= 400:
                        result["error"] = f"HTTP Error status code: {response.status_code}"
                        result["success"] = False
                    else:
                        result["success"] = True
                else:
                    # Sometimes response is null if loaded from cache or other scenarios, but if page loaded, it's successful
                    result["success"] = True
                
                # Grab final rendered HTML
                result["html"] = page.content()
                result["page_size_bytes"] = len(result["html"].encode('utf-8'))
                
                browser.close()
                
        except Exception as e:
            result["load_time_seconds"] = round(time.time() - start_time, 3)
            result["success"] = False
            result["error"] = f"Playwright execution failed: {str(e)}"

        return result
