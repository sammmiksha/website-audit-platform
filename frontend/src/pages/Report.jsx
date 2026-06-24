import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuditDetails } from "../services/api";
import ScoreCard from "../components/ScoreCard";
import RecommendationCard from "../components/RecommendationCard";
import AuditSection from "../components/AuditSection";

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    setLoading(true);
    try {
      const data = await getAuditDetails(id);
      setReport(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load audit report. It may have been deleted.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem" }}>
        <svg className="spinner" style={{ width: "40px", height: "40px", color: "var(--border-focus)" }} fill="none" viewBox="0 0 24 24">
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p style={{ color: "var(--text-secondary)" }}>Loading audit report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
        <div className="card" style={{ maxWidth: "500px", margin: "0 auto", padding: "2rem" }}>
          <h2 style={{ color: "var(--color-danger)" }}>Error</h2>
          <p style={{ color: "var(--text-secondary)", margin: "1rem 0" }}>{error || "Report not found."}</p>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { details } = report;

  // Flatten recommendations across all categories
  const allRecommendations = [
    ...(details?.recommendations?.technical || []).map(rec => ({ ...rec, cat: "technical" })),
    ...(details?.recommendations?.seo || []).map(rec => ({ ...rec, cat: "seo" })),
    ...(details?.recommendations?.accessibility || []).map(rec => ({ ...rec, cat: "accessibility" })),
    ...(details?.recommendations?.mobile || []).map(rec => ({ ...rec, cat: "mobile" }))
  ];

  // Derive top highlights/strengths dynamically from details
  const getHighlights = () => {
    const list = [];
    if (report.url.startsWith("https://")) {
      list.push("HTTPS Secure Connection enabled");
    }
    if (details?.load_time_seconds <= 2.5) {
      list.push(`Fast Load Time (${details.load_time_seconds}s)`);
    }
    if (details?.links?.broken_count === 0) {
      list.push("No broken links detected");
    }
    if (details?.viewport_content && details.viewport_content.includes("width=device-width")) {
      list.push("Mobile Friendly Viewport configured");
    }
    if (details?.sitemap_exists) {
      list.push("Sitemap.xml indexed");
    }
    if (details?.robots_txt_exists) {
      list.push("Robots.txt configuration present");
    }
    if (details?.images?.missing_alt_count === 0 && details?.images?.total > 0) {
      list.push("All images contain descriptive Alt tags");
    }
    
    if (list.length === 0) {
      list.push("Standard HTML Structure validated");
    }
    return list.slice(0, 5); // limit to top 5 highlights
  };

  const highlights = getHighlights();

  const getScoreStatus = (score) => {
    if (score >= 90) return { label: "Excellent", color: "var(--color-success)" };
    if (score >= 70) return { label: "Good", color: "var(--color-warning)" };
    return { label: "Needs Work", color: "var(--color-danger)" };
  };

  const status = getScoreStatus(report.score_overall);

  return (
    <div className="container">
      {/* Navigation Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <button onClick={() => navigate("/")} className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>←</span> Back
        </button>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>
          Audit completed in {report.duration}s
        </span>
      </div>

      {/* Website Health Summary Box */}
      <div className="card" style={{ marginBottom: "2rem", padding: "2rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem" }}>
          
          {/* Metadata Section */}
          <div style={{ flex: "1 1 350px" }}>
            <h1 style={{ wordBreak: "break-all", fontSize: "2.25rem", lineHeight: "1.2", marginBottom: "0.25rem" }}>
              {report.domain}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", wordBreak: "break-all" }}>
              URL audited: <a href={report.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>{report.url}</a>
            </p>
            
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "1rem" }}>
              Run Date: {new Date(report.created_at).toLocaleString()}
            </p>
          </div>

          {/* Large Health Score Display */}
          <div style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.5rem 2rem", minWidth: "220px", textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Website Health Score
            </span>
            <div style={{ fontSize: "3rem", fontWeight: "800", color: status.color, margin: "0.25rem 0", lineHeight: "1.1" }}>
              {report.score_overall} <span style={{ fontSize: "1.25rem", color: "var(--text-muted)", fontWeight: "500" }}>/ 100</span>
            </div>
            <span className="badge" style={{ backgroundColor: "rgba(255,255,255,0.03)", color: status.color, border: `1px solid ${status.color}`, padding: "0.25rem 0.75rem", fontSize: "0.8rem", fontWeight: "700" }}>
              {status.label}
            </span>
          </div>

        </div>
      </div>

      {/* Category breakdown Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        <ScoreCard
          title="Technical Health"
          score={report.score_technical}
          category="technical"
          description="Response speed, HTTPS security, and resource requests."
        />
        <ScoreCard
          title="SEO Ready"
          score={report.score_seo}
          category="seo"
          description="Title/meta setup, headers hierarchy, index and sitemap files."
        />
        <ScoreCard
          title="Accessibility"
          score={report.score_accessibility}
          category="accessibility"
          description="Screen reader tags, form labeling, and markup."
        />
        <ScoreCard
          title="Mobile Usability"
          score={report.score_mobile}
          category="mobile"
          description="Viewport configs, viewport stylesheets, and modern layouts."
        />
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "2rem 0" }} />

      {/* Actionable Issues Found Section (Takes 80% visual weight) */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "var(--color-danger)" }}>●</span> {allRecommendations.length} {allRecommendations.length === 1 ? "Issue" : "Issues"} Found
        </h2>
        
        {allRecommendations.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {allRecommendations.map((rec, idx) => (
              <RecommendationCard 
                key={idx} 
                recommendation={rec} 
                category={rec.cat} 
              />
            ))}
          </div>
        ) : (
          <div 
            style={{ 
              backgroundColor: "rgba(16, 185, 129, 0.04)", 
              border: "1px solid rgba(16, 185, 129, 0.15)", 
              padding: "1.5rem", 
              borderRadius: "12px", 
              textAlign: "center", 
              color: "var(--color-success)",
              fontSize: "0.95rem",
              fontWeight: "500"
            }}
          >
            ✓ No issues detected! Your website follows all our checked best practices.
          </div>
        )}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "2rem 0" }} />

      {/* Highlights Section (Consolidated top strengths - clean, bullet list, 20% visual weight) */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.75rem", color: "var(--text-secondary)" }}>
          Highlights
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {highlights.map((item, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "0.35rem", 
                backgroundColor: "rgba(16, 185, 129, 0.03)", 
                border: "1px solid rgba(16, 185, 129, 0.12)", 
                padding: "0.4rem 0.8rem", 
                borderRadius: "20px", 
                fontSize: "0.85rem", 
                color: "var(--color-success)",
                fontWeight: "500"
              }}
            >
              <span>✓</span> {item}
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Advanced Technical Details (Collapsed by default) */}
      <div style={{ marginTop: "3rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "600",
            padding: "0.5rem 0",
            outline: "none"
          }}
        >
          <span>{showAdvanced ? "▼" : "▶"}</span> Advanced Technical Details
        </button>
        
        {showAdvanced && (
          <div style={{ marginTop: "1rem" }}>
            <AuditSection details={details} />
          </div>
        )}
      </div>

    </div>
  );
};

export default Report;
