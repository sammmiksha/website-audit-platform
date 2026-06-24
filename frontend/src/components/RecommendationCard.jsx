import React, { useState } from "react";

const RecommendationCard = ({ recommendation, category }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryTheme = () => {
    switch (category) {
      case "technical":
        return { label: "Technical", color: "var(--color-technical)", bg: "rgba(56, 189, 248, 0.1)" };
      case "seo":
        return { label: "SEO", color: "var(--color-seo)", bg: "rgba(167, 139, 250, 0.1)" };
      case "accessibility":
        return { label: "Accessibility", color: "var(--color-accessibility)", bg: "rgba(251, 191, 36, 0.1)" };
      case "mobile":
        return { label: "Mobile", color: "var(--color-mobile)", bg: "rgba(244, 114, 182, 0.1)" };
      default:
        return { label: "General", color: "var(--color-info)", bg: "rgba(59, 130, 246, 0.1)" };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div 
      className="card"
      style={{
        marginBottom: "1rem",
        padding: "1.25rem",
        borderLeft: `3px solid var(--color-danger)`,
        transition: "all 0.2s"
      }}
    >
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          cursor: "pointer",
          userSelect: "none"
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span 
            style={{ 
              fontSize: "0.75rem", 
              fontWeight: "600", 
              padding: "0.2rem 0.5rem", 
              borderRadius: "4px",
              color: theme.color,
              backgroundColor: theme.bg
            }}
          >
            {theme.label}
          </span>
          <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--text-primary)" }}>
            {recommendation.title}
          </h4>
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center" }}>
          {isOpen ? (
            <span style={{ fontSize: "1.2rem" }}>▲</span>
          ) : (
            <span style={{ fontSize: "1.2rem" }}>▼</span>
          )}
        </div>
      </div>

      {isOpen && (
        <div style={{ marginTop: "1rem", paddingLeft: "0.5rem", borderLeft: "1px solid var(--border-color)", paddingTop: "0.25rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>Why it matters</span>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
              {recommendation.description}
            </p>
          </div>
          
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--color-success)", textTransform: "uppercase" }}>Suggested Fix</span>
            <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", marginTop: "0.15rem", backgroundColor: "var(--bg-primary)", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)", fontFamily: "monospace" }}>
              {recommendation.fix}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
