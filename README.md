<div align="center">

# 🔍 Website Audit Platform

**Analyze any website's technical health, SEO readiness, accessibility, and mobile responsiveness — in seconds.**

![Python](https://img.shields.io/badge/python-3.9+-8A6FE0?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/fastapi-backend-8A6FE0?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/react-frontend-8A6FE0?style=flat-square&logo=react&logoColor=white)
![Playwright](https://img.shields.io/badge/playwright-crawler-8A6FE0?style=flat-square&logo=playwright&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-database-8A6FE0?style=flat-square&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-8A6FE0?style=flat-square)

![Platform Preview](./screenshots/dashboard.png)

</div>

---

## 📌 what it does

paste a url, get a full website health report — instantly.

Website Audit Platform crawls a site and runs it through four specialized audit engines, then generates a scored, human-readable report covering what's working, what's broken, and what to fix. no configuration, no accounts, just a url.

---

## 🖥️ screenshots

| Home | Audit Report |
|:---:|:---:|
| ![Home](./screenshots/home.png) | ![Report](./screenshots/report.png) |

---

## ⚙️ how it works

```
URL Input
   │
   ▼
Crawler Engine (static → Playwright fallback for SPAs)
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

**crawling strategy** — a two-tier approach:

1. **static crawl** (Requests + BeautifulSoup4) — fast, lightweight, handles most sites
2. **Playwright fallback** — auto-triggered for JS-heavy sites (React, Vue, Angular, SPAs)

---

## 📊 audit categories

<details open>
<summary><b>🛡️ technical health</b></summary>

| Check | Description |
|-------|-------------|
| HTTPS | Verifies secure connection |
| Response Time | Measures page load speed |
| Page Size | Evaluates total resource weight |
| Broken Links | Detects broken homepage links |
| Resource Usage | Audits request count and types |

</details>

<details open>
<summary><b>🔎 seo readiness</b></summary>

| Check | Description |
|-------|-------------|
| Title Tag | Presence and optimal length (50–60 chars) |
| Meta Description | Presence and length (120–160 chars) |
| H1 Structure | Single, well-formed heading |
| Canonical URL | Correct canonical tag setup |
| Robots.txt | Accessibility and configuration |
| Sitemap.xml | Presence and validity |

</details>

<details open>
<summary><b>♿ accessibility</b></summary>

| Check | Description |
|-------|-------------|
| Image Alt Text | All images have descriptive alt attributes |
| Heading Hierarchy | Logical H1→H6 structure |
| Form Labels | All form inputs are labeled |
| Language Declaration | `lang` attribute on `<html>` |

</details>

<details open>
<summary><b>📱 mobile responsiveness</b></summary>

| Check | Description |
|-------|-------------|
| Viewport Meta Tag | Correct viewport configuration |
| Responsive Indicators | Flexbox, Grid usage detected |
| Media Queries | Presence of responsive breakpoints |
| Legacy Issues | Detection of fixed-width or mobile-unfriendly patterns |

</details>

---

## 📈 scoring

each category gets a score out of 100, weighted by issue severity. an overall health score is computed as a weighted average across all four.

| Score Range | Rating |
|:---:|:---|
| 90–100 | Excellent ✅ |
| 70–89 | Good 🟡 |
| 50–69 | Needs Work 🟠 |
| 0–49 | Poor 🔴 |

---

## 🛠️ tech stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React, React Router, Axios, CSS Modules |
| **Backend** | FastAPI, Python, Pydantic, SQLAlchemy |
| **Crawling** | Requests, BeautifulSoup4, Playwright |
| **Database** | SQLite |

---

## 🚀 getting started

### prerequisites
- Python 3.9+
- Node.js 18+

### backend setup

```bash
git clone https://github.com/sammmiksha/website-audit-platform.git
cd website-audit-platform

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
playwright install chromium

uvicorn main:app --reload
```

API → `http://localhost:8000` · Swagger docs → `http://localhost:8000/docs`

### frontend setup

```bash
cd frontend
npm install
npm run dev
```

App → `http://localhost:5173`

---

## 📁 project structure

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
│   │   └── mobile.py           # Mobile responsiveness checks
│   ├── scoring.py              # Score computation logic
│   └── models.py               # SQLAlchemy models
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

## ✨ key features

- **dual-mode crawling** — static + Playwright for full SPA support
- **four-category scoring** — actionable numbers, not vague grades
- **audit history** — all past reports stored and accessible
- **human-readable output** — built for developers and non-technical users alike
- **fast analysis** — most audits complete in under 10 seconds

---

## 🔮 planned improvements

- [ ] multi-page crawling (full site analysis, not just homepage)
- [ ] PDF report export
- [ ] historical score tracking over time
- [ ] competitor comparison mode
- [ ] scheduled / automated audits
- [ ] deeper performance metrics (LCP, CLS, FID)

---

## 🧠 what i learned

building this gave me hands-on experience with:

- web crawling strategies and HTML parsing at scale
- FastAPI application architecture and async endpoints
- SEO fundamentals and how search engines evaluate pages
- WCAG accessibility standards
- responsive design detection heuristics
- full-stack integration: React ↔ FastAPI ↔ SQLite

---

<div align="center">

## 📬 contact

**Samiksha Patil**

[![GitHub](https://img.shields.io/badge/GitHub-sammmiksha-8A6FE0?style=flat-square&logo=github&logoColor=white)](https://github.com/sammmiksha)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sammmikshapatil-8A6FE0?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/sammmikshapatil)
[![Portfolio](https://img.shields.io/badge/Portfolio-visit-8A6FE0?style=flat-square&logo=vercel&logoColor=white)](https://samiksha-pedenekar.netlify.app)

*built with React & FastAPI · © 2026 Website Audit Platform*

</div>
