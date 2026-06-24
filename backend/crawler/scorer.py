from typing import Dict, Any

class Scorer:
    def calculate_overall(self, technical: int, seo: int, accessibility: int, mobile: int) -> int:
        """
        Calculates the overall score as a rounded average of the four sub-scores.
        """
        total = technical + seo + accessibility + mobile
        return int(round(total / 4.0))
