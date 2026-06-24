import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAudits, triggerAudit, deleteAudit } from "../services/api";

const Home = () => {
  const [urlInput, setUrlInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load audit history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getAudits();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load audit history", err);
    }
  };

  const handleAuditSubmit = async (e) => {
    e.preventDefault();
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) return;

    setLoading(true);
    setError("");
    setLoadingStatus("Validating URL host accessibility...");

    // Simulated status messages to show progress
    const statusSteps = [
      { delay: 1500, msg: "Crawl initial static HTML elements..." },
      { delay: 3500, msg: "Checking for Single Page App structures..." },
      { delay: 5500, msg: "Analyzing technical, SEO and accessibility metrics..." },
      { delay: 7500, msg: "Testing broken links sample on homepage..." },
      { delay: 9500, msg: "Compiling scoring and recommendation engine..." }
    ];

    const timers = statusSteps.map(step => 
      setTimeout(() => setLoadingStatus(step.msg), step.delay)
    );

    try {
      const report = await triggerAudit(cleanUrl);
      timers.forEach(t => clearTimeout(t));
      navigate(`/report/${report.id}`);
    } catch (err) {
      timers.forEach(t => clearTimeout(t));
      const errMsg = err.response?.data?.detail || "Unable to access website.";
      setError(errMsg);
    } finally {
      setLoading(false);
      setLoadingStatus("");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid triggering row navigation if row has click
    if (!window.confirm("Are you sure you want to delete this audit report?")) return;

    try {
      await deleteAudit(id);
      setHistory(history.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete audit report.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "var(--color-success)";
    if (score >= 70) return "var(--color-warning)";
    return "var(--color-danger)";
  };

  return (
    <div className="container">
      {/* Title Section */}
      <div style={{ textAlign: "center", margin: "3rem 0 2.5rem 0" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(135deg, #60a5fa, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Website Audit Platform
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "600px", margin: "0.5rem auto 0 auto" }}>
          Analyze website health instantly. Get simple, human-readable insights on Technical structure, SEO visibility, Accessibility compliance, and Mobile responsiveness.
        </p>
      </div>

      {/* Audit Box */}
      <div className="card" style={{ maxWidth: "700px", margin: "0 auto 3rem auto", padding: "2rem" }}>
        <form onSubmit={handleAuditSubmit} style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
          <label htmlFor="audit-url-input" style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-secondary)" }}>
            Enter Website URL to Analyze
          </label>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              id="audit-url-input"
              type="text"
              className="input-text"
              placeholder="e.g. https://example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={loading}
              autoFocus
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flexShrink: 0, minWidth: "130px" }}
            >
              {loading ? "Analyzing..." : "Run Audit"}
            </button>
          </div>
        </form>

        {/* Loading Spinner and Status Messages */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "1.5rem", gap: "0.5rem" }}>
            <svg className="spinner" style={{ width: "32px", height: "32px", color: "var(--border-focus)" }} fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500" }}>{loadingStatus}</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{ marginTop: "1.25rem", padding: "0.75rem 1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", color: "var(--color-danger)", fontSize: "0.9rem" }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* History Section */}
      <div>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "1rem" }}>
          Audit History
        </h2>

        {history.length > 0 ? (
          <div className="card" style={{ padding: "0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)", fontWeight: "600" }}>
                  <th style={{ padding: "1rem" }}>Domain / URL</th>
                  <th style={{ padding: "1rem", width: "140px" }}>Date</th>
                  <th style={{ padding: "1rem", width: "110px", textAlign: "center" }}>Overall Score</th>
                  <th style={{ padding: "1rem", width: "110px", textAlign: "center" }}>Duration</th>
                  <th style={{ padding: "1rem", width: "130px" }}>Crawl Method</th>
                  <th style={{ padding: "1rem", width: "160px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="card-interactive"
                    style={{ borderBottom: "1px solid var(--border-color)", cursor: "pointer", transition: "background-color 0.15s" }}
                    onClick={() => navigate(`/report/${item.id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.01)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{item.domain}</span>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", wordBreak: "break-all", marginTop: "0.1rem" }}>{item.url}</div>
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      {formatDate(item.created_at)}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <span 
                        style={{ 
                          display: "inline-flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "36px", 
                          height: "36px", 
                          borderRadius: "50%", 
                          border: `2px solid ${getScoreColor(item.score_overall)}`,
                          color: getScoreColor(item.score_overall),
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          backgroundColor: "rgba(0,0,0,0.2)"
                        }}
                      >
                        {item.score_overall}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      {item.duration}s
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span className="badge" style={{ fontSize: "0.65rem", backgroundColor: item.crawler_type === "playwright" ? "rgba(244,114,182,0.1)" : "rgba(56,189,248,0.1)", color: item.crawler_type === "playwright" ? "var(--color-mobile)" : "var(--color-technical)", border: "none" }}>
                        {item.crawler_type === "playwright" ? "Playwright" : "Static"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => navigate(`/report/${item.id}`)}
                          className="btn btn-secondary"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                        >
                          View Report
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="btn btn-danger"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "1rem", fontStyle: "italic" }}>
              No audits have been executed yet. Run your first audit using the input box above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
