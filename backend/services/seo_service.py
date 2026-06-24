from typing import Dict, Any, List

class SeoService:
    def audit(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes search engine optimization elements of the website.
        """
        score = 100
        strengths = []
        recommendations = []

        # 1. Title Tag
        title = data["title"]
        if not title:
            score -= 30
            recommendations.append({
                "title": "Add a Page Title Tag",
                "description": "Your webpage is missing a <title> tag. Search engines use the title to understand page content and display search snippets.",
                "fix": "Include a descriptive <title> tag in the HTML <head> section that summarizes what the page is about."
            })
        else:
            title_len = len(title)
            if title_len < 10 or title_len > 70:
                score -= 10
                recommendations.append({
                    "title": f"Optimize Title Tag Length ({title_len} characters)",
                    "description": f"The page title length is {title_len} characters. Ideally, titles should be between 10 and 60-70 characters to avoid truncation in search engine result pages.",
                    "fix": "Rewrite the title to be descriptive, concise, and between 10-60 characters, containing your primary keywords."
                })
            else:
                strengths.append(f"Title tag is present and optimal length ({title_len} characters): '{title}'.")

        # 2. Meta Description
        meta_desc = data["meta_description"]
        if not meta_desc:
            score -= 25
            recommendations.append({
                "title": "Add a Meta Description",
                "description": "The webpage lacks a meta description. Search engines display this description as a snippet under your title in search results.",
                "fix": "Add a <meta name=\"description\" content=\"...\"> tag to the HTML <head> describing the contents of the page."
            })
        else:
            meta_len = len(meta_desc)
            if meta_len < 50 or meta_len > 160:
                score -= 10
                recommendations.append({
                    "title": f"Optimize Meta Description Length ({meta_len} characters)",
                    "description": f"The meta description length is {meta_len} characters. Keeping descriptions between 50 and 160 characters ensures they fit well in search snippets.",
                    "fix": "Revise the meta description to summarize page content within a 50-160 character limit while prompting user clicks."
                })
            else:
                strengths.append("Meta description is present and of optimal length.")

        # 3. Headings Structure (H1 Check)
        h1s = data["headings"].get("h1", [])
        if not h1s:
            score -= 15
            recommendations.append({
                "title": "Add a Heading 1 (H1) Tag",
                "description": "No H1 heading tag was found. The H1 heading is the most important header on the page and indicates the main topic.",
                "fix": "Wrap your main page title in an <h1>...</h1> tag near the top of the body content."
            })
        elif len(h1s) > 1:
            score -= 10
            recommendations.append({
                "title": "Use a Single H1 Tag",
                "description": f"We detected {len(h1s)} H1 tags. Using multiple H1 tags can dilute page focus and confuse search engines.",
                "fix": "Consolidate your main headings so that only one primary H1 tag exists, and convert secondary H1 headings into H2 or H3 tags."
            })
        else:
            strengths.append(f"Proper H1 tag usage: exactly one primary heading found ('{h1s[0]}').")

        # 4. Search Visibility Files
        if data["robots_txt_exists"]:
            strengths.append("robots.txt file detected (tells search engines which paths to crawl).")
        else:
            score -= 10
            recommendations.append({
                "title": "Create a robots.txt File",
                "description": "No robots.txt file was detected. A robots.txt file guides web crawlers on which sections of the site should or shouldn't be indexed.",
                "fix": "Create a file named 'robots.txt' in the root directory of your website and specify crawl rules (e.g., User-agent: * Allow: /)."
            })

        if data["sitemap_exists"]:
            strengths.append("sitemap.xml file detected (helps search engines discover your pages).")
        else:
            score -= 10
            recommendations.append({
                "title": "Provide a sitemap.xml File",
                "description": "No sitemap.xml file was detected. Sitemaps catalog your pages, helping search engines crawl your site more efficiently.",
                "fix": "Generate an XML sitemap of all public URLs on your website and save it as 'sitemap.xml' in your root directory."
            })

        # 5. Canonical Tag Check
        if data["canonical_url"]:
            strengths.append(f"Canonical URL tag detected: '{data['canonical_url']}'.")
        else:
            score -= 10
            recommendations.append({
                "title": "Specify a Canonical URL",
                "description": "No canonical tag was found. Without a canonical tag, search engines may treat URL variations (e.g. with and without www) as duplicate content.",
                "fix": "Add a <link rel=\"canonical\" href=\"https://yourdomain.com/page\" /> tag inside your webpage head."
            })

        return {
            "score": max(score, 0),
            "strengths": strengths,
            "recommendations": recommendations
        }
