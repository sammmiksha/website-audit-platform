# 🔍 Website Audit Platform

> Analyze any website's technical health, SEO readiness, accessibility, and mobile responsiveness — in seconds.

![Platform Preview](./screenshots/dashboard.png)

Built with **FastAPI** · **React** · **BeautifulSoup4** · **Playwright** · **SQLite**

---

## 📌 What It Does

Paste a URL. Get a full website health report — instantly.

Website Audit Platform crawls a website and runs it through four specialized audit engines, then generates a scored, human-readable report covering what's working, what's broken, and what to fix.

No configuration required. No accounts. Just a URL.

---

## 🖥️ Screenshots

| Home | Audit Report |
|------|-------------|
| ![Home](./screenshots/home.png) | ![Report](./screenshots/report.png) |

---

## ⚙️ How It Works

```
URL Input
   │
   ▼
Crawler Engine (Static → Playwright fallback for SPAs)
   │
   ▼
Content Extraction
(title, meta, headings, links, images, robots.txt, sitemap)
   │
   ▼
Audit Engines
   ├── Technical Health
   ├── SEO Analysis
   ├── Accessibility
   └── Mobile Responsiveness
   │
   ▼
Scoring Engine (0–100 per category)
   │
   ▼
Interactive Report Dashboard
```

### Crawling Strategy

The platform uses a **two-tier crawling approach**:

1. **Static crawl** (Requests + BeautifulSoup4) — fast, lightweight, handles most sites
2. **Playwright fallback** — automatically triggered for JavaScript-heavy sites (React, Vue, Angular, SPAs)

---

## 📊 Audit Categories

### 🛡️ Technical Health
| Check | Description |
|-------|-------------|
| HTTPS | Verifies secure connection |
| Response Time | Measures page load speed |
| Page Size | Evaluates total resource weight |
| Broken Links | Detects broken homepage links |
| Resource Usage | Audits request count and types |

### 🔎 SEO Readiness
| Check | Description |
|-------|-------------|
| Title Tag | Presence and optimal length (50–60 chars) |
| Meta Description | Presence and length (120–160 chars) |
| H1 Structure | Single, well-formed heading |
| Canonical URL | Correct canonical tag setup |
| Robots.txt | Accessibility and configuration |
| Sitemap.xml | Presence and validity |

### ♿ Accessibility
| Check | Description |
|-------|-------------|
| Image Alt Text | All images have descriptive alt attributes |
| Heading Hierarchy | Logical H1→H6 structure |
| Form Labels | All form inputs are labeled |
| Language Declaration | `lang` attribute on `<html>` |

### 📱 Mobile Responsiveness
| Check | Description |
|-------|-------------|
| Viewport Meta Tag | Correct viewport configuration |
| Responsive Indicators | Flexbox, Grid usage detected |
| Media Queries | Presence of responsive breakpoints |
| Legacy Issues | Detection of fixed-width or mobile-unfriendly patterns |

---

## 📈 Scoring

Each category receives a **score out of 100**, weighted by the severity of issues found.

An **overall website health score** is computed as a weighted average across all four categories.

| Score Range | Rating |
|-------------|--------|
| 90–100 | Excellent ✅ |
| 70–89 | Good 🟡 |
| 50–69 | Needs Work 🟠 |
| 0–49 | Poor 🔴 |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React, React Router, Axios, CSS Modules |
| **Backend** | FastAPI, Python, Pydantic, SQLAlchemy |
| **Crawling** | Requests, BeautifulSoup4, Playwright |
| **Database** | SQLite |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/sammmiksha/website-audit-platform.git
cd website-audit-platform

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Start the API server
uvicorn main:app --reload
```

API will be available at `http://localhost:8000`  
Swagger docs at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
website-audit-platform/
├── backend/
│   ├── main.py                 # FastAPI app & routes
│   ├── crawler/
│   │   ├── static_crawler.py   # Requests + BeautifulSoup crawler
│   │   └── playwright_crawler.py
│   ├── audit/
│   │   ├── technical.py        # Technical health checks
│   │   ├── seo.py              # SEO audit engine
│   │   ├── accessibility.py    # Accessibility checks
│   │   └── mobile.py          # Mobile responsiveness checks
│   ├── scoring.py              # Score computation logic
│   └── models.py              # SQLAlchemy models
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx        # URL input + audit history
    │   │   └── Report.jsx      # Audit results dashboard
    │   └── components/         # Reusable UI components
    └── package.json
```

---

## ✨ Key Features

- **Dual-mode crawling** — static + Playwright for full SPA support
- **Four-category scoring** — actionable numbers, not vague grades
- **Audit history** — all past reports stored and accessible
- **Human-readable output** — designed for developers and non-technical users alike
- **Fast analysis** — most audits complete in under 10 seconds

---

## 🔮 Planned Improvements

- [ ] Multi-page crawling (full site analysis, not just homepage)
- [ ] PDF report export
- [ ] Historical score tracking over time
- [ ] Competitor comparison mode
- [ ] Scheduled / automated audits
- [ ] Deeper performance metrics (LCP, CLS, FID)

---

## 🧠 What I Learned

Building this project gave me hands-on experience with:

- Web crawling strategies and HTML parsing at scale
- FastAPI application architecture and async endpoints
- SEO fundamentals and how search engines evaluate pages
- WCAG accessibility standards
- Responsive design detection heuristics
- Full-stack integration: React frontend ↔ FastAPI backend ↔ SQLite

---

## 📬 Contact

**Samiksha Patil**  
[GitHub](https://github.com/sammmiksha) · [LinkedIn](https://linkedin.com/in/sammmikshapatil) · [Portfolio](https://samiksha-pedenekar.netlify.app)

---

*Built with React & FastAPI · © 2026 Website Audit Platform*
