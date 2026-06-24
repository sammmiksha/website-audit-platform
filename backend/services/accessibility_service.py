from typing import Dict, Any, List

class AccessibilityService:
    def audit(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes accessibility features of the website.
        """
        score = 100
        strengths = []
        recommendations = []

        # 1. Image Alt Text Check
        total_images = len(data["images"])
        missing_alt_count = sum(1 for img in data["images"] if img["alt"] is None)

        if total_images == 0:
            strengths.append("No images detected on page. (No image accessibility issues.)")
        elif missing_alt_count == 0:
            strengths.append(f"All {total_images} images have 'alt' attributes for screen readers.")
        else:
            pct_missing = (missing_alt_count / total_images) * 100
            deduction = min(round(pct_missing * 0.35, 1), 30)
            score -= deduction
            recommendations.append({
                "title": f"Add Image Alt Attributes ({missing_alt_count}/{total_images} missing)",
                "description": f"{missing_alt_count} out of {total_images} image tags lack an 'alt' attribute. Visually impaired users relying on screen readers won't understand these images.",
                "fix": "Locate image tags that lack descriptions and add an 'alt' attribute containing a brief, descriptive text summarizing the image (e.g., alt=\"Company logo\"). For purely decorative images, use empty alt values (alt=\"\")."
            })

        # 2. Heading Jumps Check
        h_presence = [
            len(data["headings"].get(f"h{i}", [])) > 0 for i in range(1, 7)
        ]
        
        # Check for heading level skips (e.g., having H3 but no H2, etc.)
        skipped = False
        for i in range(1, 5): # Check H2 to H5
            # If h(i+1) is present but h(i) is missing
            if h_presence[i] and not h_presence[i-1] and any(h_presence[:i]):
                skipped = True
                break
        
        if not skipped:
            strengths.append("Heading hierarchy flows sequentially without skipped heading levels.")
        else:
            score -= 20
            recommendations.append({
                "title": "Fix Heading Hierarchy Jumps",
                "description": "The webpage skips heading levels (e.g., jumping from H1 directly to H3). This breaks content structure for screen readers.",
                "fix": "Restructure your content headings sequentially (H1 followed by H2, then H3, etc.) without skipping levels."
            })

        # 3. Missing Labels Check
        input_count = data["input_count"]
        label_count = data["label_count"]
        
        # Simple indicator check for forms: we check if there are inputs but fewer labels
        if input_count > 0:
            if label_count >= input_count:
                strengths.append(f"Form labels are present ({label_count} labels for {input_count} inputs).")
            else:
                score -= 30
                recommendations.append({
                    "title": "Ensure Form Fields Have Associated Labels",
                    "description": f"We detected {input_count} input fields but only {label_count} labels. Form fields without associated labels are hard for screen readers to describe to users.",
                    "fix": "Wrap input elements inside a <label> tag, or use the 'id' attribute on the input and match it with a 'for' attribute on the <label> tag."
                })
        else:
            strengths.append("No form fields detected. (No label accessibility issues.)")

        # 4. HTML Language Attribute
        html_lang = data["html_lang"]
        if html_lang:
            strengths.append(f"HTML language attribute is defined: lang='{html_lang}'.")
        else:
            score -= 20
            recommendations.append({
                "title": "Define HTML Lang Attribute",
                "description": "The <html> tag is missing a 'lang' attribute. Screen readers need this to know what language to read the page content in.",
                "fix": "Add the lang attribute to the <html> tag in your templates, for example: <html lang=\"en\">."
            })

        return {
            "score": int(max(score, 0)),
            "strengths": strengths,
            "recommendations": recommendations
        }
