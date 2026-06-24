from typing import Dict, Any, List

class TechnicalService:
    def audit(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes technical elements of the website.
        """
        score = 100
        strengths = []
        recommendations = []

        # 1. HTTPS Check
        is_https = data["url"].startswith("https://")
        if is_https:
            strengths.append("HTTPS is enabled, securing traffic between client and server.")
        else:
            score -= 30
            recommendations.append({
                "title": "Enable HTTPS Connection",
                "description": "The website is served over unencrypted HTTP, which poses security risks and negatively impacts SEO.",
                "fix": "Obtain an SSL certificate (e.g., from Let's Encrypt) and configure your web server to redirect all HTTP requests to HTTPS."
            })

        # 2. Broken Links Check
        broken_count = data["links"]["broken_count"]
        if broken_count == 0:
            strengths.append("No broken links were found in the homepage link sample.")
        else:
            deduction = min(broken_count * 15, 30)
            score -= deduction
            recommendations.append({
                "title": f"Fix Broken Links ({broken_count} detected)",
                "description": f"We detected {broken_count} broken links (returning 400+ status codes) on your homepage.",
                "fix": "Identify which links in the report are broken and update their href attributes to point to active target pages."
            })

        # 3. Load Time Check
        load_time = data["load_time_seconds"]
        if load_time <= 1.5:
            strengths.append(f"Excellent response time ({load_time}s). The page loaded very quickly.")
        elif load_time <= 3.0:
            strengths.append(f"Moderate response time ({load_time}s). Inside acceptable range.")
        else:
            score -= 20
            recommendations.append({
                "title": f"Improve Page Response Time ({load_time}s)",
                "description": f"The page took {load_time} seconds to respond. Users are likely to leave websites that load slowly.",
                "fix": "Optimize server response time, utilize CDN caching, minify CSS/JS files, and defer non-critical scripts."
            })

        # 4. Page Size Check
        page_size_mb = data["page_size_bytes"] / (1024 * 1024)
        if page_size_mb <= 1.5:
            strengths.append(f"Optimal page size ({round(page_size_mb, 2)} MB). Helps ensure fast mobile loads.")
        elif page_size_mb <= 3.0:
            pass  # acceptable
        else:
            score -= 20
            recommendations.append({
                "title": f"Reduce Page Size ({round(page_size_mb, 2)} MB)",
                "description": f"The page payload size is {round(page_size_mb, 2)} MB. Large page sizes delay loading, especially on mobile data networks.",
                "fix": "Compress high-resolution images, enable gzip/brotli compression, remove unused CSS/JS code, and lazy-load offscreen media."
            })

        # 5. Asset Count Check
        stylesheet_count = data["stylesheet_count"]
        script_count = data["script_count"]
        if stylesheet_count > 12 or script_count > 25:
            score -= 10
            recommendations.append({
                "title": f"Reduce Render-Blocking Resources ({stylesheet_count} CSS, {script_count} JS)",
                "description": "Having too many external stylesheets and script tags creates excessive HTTP requests and delays rendering.",
                "fix": "Combine and bundle your CSS and JS files where possible, remove unused packages, and use the 'async' or 'defer' attributes on script tags."
            })
        else:
            strengths.append(f"Efficient resource count: page requests {stylesheet_count} stylesheets and {script_count} scripts.")

        return {
            "score": max(score, 0),
            "strengths": strengths,
            "recommendations": recommendations
        }
