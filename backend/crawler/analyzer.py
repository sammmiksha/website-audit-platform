import re
import requests
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
from typing import Dict, Any, List
from crawler.static_crawler import StaticCrawler
from crawler.playwright_crawler import PlaywrightCrawler

class Analyzer:
    def __init__(self):
        self.static_crawler = StaticCrawler()
        self.playwright_crawler = PlaywrightCrawler()

    def is_valid_url(self, url: str) -> bool:
        """Simple regex check for URL validation"""
        parsed = urlparse(url)
        # If no scheme, try to parse it by adding https://
        if not parsed.scheme:
            parsed = urlparse("https://" + url)
        
        # Check if we have a valid domain-like structure
        domain = parsed.netloc or parsed.path
        if "." not in domain or len(domain.split(".")) < 2:
            return False
            
        return True

    def check_url_availability(self, url: str) -> bool:
        """Verifies if the host is reachable"""
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url
            
        try:
            requests.head(url, timeout=5, allow_redirects=True)
            return True
        except Exception:
            try:
                requests.get(url, timeout=5, allow_redirects=True)
                return True
            except Exception:
                return False

    def analyze(self, url: str) -> Dict[str, Any]:
        """
        Runs the crawling and analyzes the website.
        """
        # 1. URL Validation
        if not self.is_valid_url(url):
            return {
                "success": False,
                "error_message": "Invalid URL format."
            }

        # Normalize URL
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url

        # 2. Check accessibility
        if not self.check_url_availability(url):
            # Try HTTP as fallback
            if url.startswith("https://"):
                http_url = url.replace("https://", "http://")
                if not self.check_url_availability(http_url):
                    return {
                        "success": False,
                        "error_message": "Unable to access website."
                    }
                else:
                    url = http_url
            else:
                return {
                    "success": False,
                    "error_message": "Unable to access website."
                }

        # 3. Static Crawling first
        crawl_result = self.static_crawler.crawl(url)
        
        # 4. Check if we need Playwright (incomplete content / client-side rendering detection)
        # Signatures of incomplete static content:
        # - Empty body
        # - Standard single page app shells (e.g. only containing <div id="root"></div> or <div id="app"></div> with no content)
        # - Extremely short HTML length on success
        needs_playwright = False
        if crawl_result["success"]:
            html_content = crawl_result["html"]
            soup = BeautifulSoup(html_content, "html.parser")
            body = soup.find("body")
            
            if body:
                body_text = body.get_text(strip=True)
                # Check for client-side rendering shells
                app_roots = soup.find_all(id=["root", "app", "__next", "nuxt-app"])
                
                # If body text is very short but we have app roots, or if body text is practically empty
                if (len(body_text) < 150 and app_roots) or len(body_text) < 30:
                    needs_playwright = True
        else:
            # If static crawl fails, let's try Playwright as a fallback
            needs_playwright = True

        # 5. Playwright fallback if needed
        if needs_playwright:
            playwright_result = self.playwright_crawler.crawl(url)
            if playwright_result["success"]:
                crawl_result = playwright_result

        if not crawl_result["success"]:
            return {
                "success": False,
                "error_message": crawl_result["error"] or "Unable to access website."
            }

        # 6. Extract data from crawl result HTML
        html = crawl_result["html"]
        resolved_url = crawl_result["resolved_url"]
        soup = BeautifulSoup(html, "html.parser")
        
        parsed_url = urlparse(resolved_url)
        domain = parsed_url.netloc
        base_url = f"{parsed_url.scheme}://{domain}"

        # Extract title
        title_tag = soup.find("title")
        title = title_tag.get_text().strip() if title_tag else ""

        # Extract meta description
        meta_desc_tag = soup.find("meta", attrs={"name": "description"})
        if not meta_desc_tag:
            meta_desc_tag = soup.find("meta", attrs={"property": "og:description"})
        meta_desc = meta_desc_tag.get("content", "").strip() if meta_desc_tag else ""

        # Extract canonical URL
        canonical_tag = soup.find("link", rel="canonical")
        canonical_url = canonical_tag.get("href", "").strip() if canonical_tag else ""

        # Extract Headings
        headings = {}
        for i in range(1, 7):
            headings[f"h{i}"] = [h.get_text(strip=True) for h in soup.find_all(f"h{i}")]

        # Extract Images and alt texts
        images_found = soup.find_all("img")
        images = []
        for img in images_found:
            src = img.get("src", "")
            alt = img.get("alt") # Keep alt as None if missing entirely
            images.append({
                "src": urljoin(resolved_url, src) if src else "",
                "alt": alt
            })

        # Extract Links
        links_found = soup.find_all("a")
        internal_links = set()
        external_links = set()
        for link in links_found:
            href = link.get("href", "").strip()
            if not href or href.startswith(("#", "javascript:", "mailto:", "tel:")):
                continue
            
            absolute_url = urljoin(resolved_url, href)
            # Normalize url for comparison
            parsed_link = urlparse(absolute_url)
            if parsed_link.netloc == domain:
                internal_links.add(absolute_url)
            else:
                external_links.add(absolute_url)

        internal_links_list = sorted(list(internal_links))
        external_links_list = sorted(list(external_links))

        # Extract open graph tags
        og_tags = {}
        for og_tag in soup.find_all("meta", property=re.compile(r"^og:")):
            og_tags[og_tag.get("property")] = og_tag.get("content", "")

        # Robots.txt detection
        robots_url = f"{base_url}/robots.txt"
        robots_exists = False
        try:
            robots_resp = requests.get(robots_url, timeout=3, headers=self.static_crawler.headers)
            robots_exists = robots_resp.status_code == 200
        except Exception:
            pass

        # Sitemap.xml detection
        sitemap_url = f"{base_url}/sitemap.xml"
        sitemap_exists = False
        try:
            sitemap_resp = requests.get(sitemap_url, timeout=3, headers=self.static_crawler.headers)
            sitemap_exists = sitemap_resp.status_code == 200
        except Exception:
            pass

        # Viewport tag detection
        viewport_tag = soup.find("meta", attrs={"name": "viewport"})
        viewport_content = viewport_tag.get("content", "") if viewport_tag else ""

        # Stylesheet count and script count
        stylesheets = [link.get("href") for link in soup.find_all("link", rel="stylesheet")]
        scripts = [script.get("src") for script in soup.find_all("script") if script.get("src")]

        # HTML Lang tag
        html_tag = soup.find("html")
        html_lang = html_tag.get("lang", "") if html_tag else ""

        # Form elements and labels
        forms = soup.find_all("form")
        inputs = soup.find_all("input")
        labels = soup.find_all("label")
        
        # Performance checks (simple responsive units inside style attributes)
        has_media_queries = False
        # Look for inline style tags with media queries or responsive units
        style_tags = soup.find_all("style")
        style_content = " ".join([tag.get_text() for tag in style_tags])
        if "@media" in style_content or any(unit in style_content for unit in ["vw", "vh", "rem", "em"]):
            has_media_queries = True

        # 7. Check a sample of links (homepage-discovered) to check if broken
        # We sample up to 5 internal and 5 external links to test response code
        sample_internal = internal_links_list[:5]
        sample_external = external_links_list[:5]
        links_tested = []
        broken_links_count = 0

        for test_link in sample_internal + sample_external:
            is_internal = test_link in internal_links
            try:
                # Do a HEAD request first (quicker)
                resp = requests.head(test_link, timeout=3, allow_redirects=True, headers=self.static_crawler.headers)
                status = resp.status_code
                if status >= 400:
                    # Double check with a GET request
                    resp_get = requests.get(test_link, timeout=3, allow_redirects=True, headers=self.static_crawler.headers)
                    status = resp_get.status_code
            except Exception:
                status = 404 # Treated as broken if request throws error
            
            is_broken = status >= 400 or status is None
            if is_broken:
                broken_links_count += 1
                
            links_tested.append({
                "url": test_link,
                "status_code": status,
                "is_internal": is_internal,
                "is_broken": is_broken
            })

        # Assemble basic output payload
        extracted_data = {
            "success": True,
            "url": resolved_url,
            "domain": domain,
            "crawler_type": crawl_result["crawler_type"],
            "load_time_seconds": crawl_result["load_time_seconds"],
            "page_size_bytes": crawl_result["page_size_bytes"],
            "title": title,
            "meta_description": meta_desc,
            "canonical_url": canonical_url,
            "headings": headings,
            "images": images,
            "links": {
                "internal_count": len(internal_links_list),
                "external_count": len(external_links_list),
                "internal_list": internal_links_list,
                "external_list": external_links_list,
                "tested": links_tested,
                "broken_count": broken_links_count
            },
            "og_tags": og_tags,
            "robots_txt_exists": robots_exists,
            "sitemap_exists": sitemap_exists,
            "viewport_content": viewport_content,
            "stylesheet_count": len(stylesheets),
            "script_count": len(scripts),
            "html_lang": html_lang,
            "has_media_queries": has_media_queries,
            "form_count": len(forms),
            "input_count": len(inputs),
            "label_count": len(labels)
        }

        return extracted_data
