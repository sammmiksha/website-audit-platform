import time
import requests
from typing import Dict, Any, Optional

class StaticCrawler:
    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        }

    def crawl(self, url: str) -> Dict[str, Any]:
        """
        Crawls a URL statically using requests.
        Returns a dictionary with HTML content, response time, status code, etc.
        """
        result = {
            "url": url,
            "resolved_url": url,
            "status_code": None,
            "html": "",
            "load_time_seconds": 0.0,
            "page_size_bytes": 0,
            "headers": {},
            "success": False,
            "error": None,
            "crawler_type": "static"
        }

        # Normalize URL
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url

        start_time = time.time()
        try:
            # First try HTTPS, then HTTP if it fails
            response = requests.get(
                url, 
                headers=self.headers, 
                timeout=self.timeout, 
                allow_redirects=True
            )
            
            result["load_time_seconds"] = round(time.time() - start_time, 3)
            result["status_code"] = response.status_code
            result["html"] = response.text
            result["page_size_bytes"] = len(response.content)
            result["resolved_url"] = response.url
            result["headers"] = dict(response.headers)
            
            if response.status_code >= 200 and response.status_code < 400:
                result["success"] = True
            else:
                result["error"] = f"HTTP Error status code: {response.status_code}"
                
        except requests.exceptions.SSLError:
            # Fall back to http or log SSL error
            try:
                # If HTTPS fails due to SSL, try HTTP
                http_url = url.replace("https://", "http://")
                response = requests.get(
                    http_url, 
                    headers=self.headers, 
                    timeout=self.timeout, 
                    allow_redirects=True
                )
                result["load_time_seconds"] = round(time.time() - start_time, 3)
                result["status_code"] = response.status_code
                result["html"] = response.text
                result["page_size_bytes"] = len(response.content)
                result["resolved_url"] = response.url
                result["headers"] = dict(response.headers)
                
                if response.status_code >= 200 and response.status_code < 400:
                    result["success"] = True
                else:
                    result["error"] = f"HTTP Error status code: {response.status_code}"
            except Exception as e:
                result["load_time_seconds"] = round(time.time() - start_time, 3)
                result["success"] = False
                result["error"] = f"SSL Connection failed, and HTTP fallback failed: {str(e)}"
        except Exception as e:
            result["load_time_seconds"] = round(time.time() - start_time, 3)
            result["success"] = False
            result["error"] = f"Connection failed: {str(e)}"

        return result
