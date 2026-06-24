import React from "react";

const ScoreCard = ({ title, score, category, description }) => {
  // Get color classes based on category type
  const getCategoryStyles = () => {
    switch (category) {
      case "technical":
        return {
          color: "var(--color-technical)",
          border: "rgba(56, 189, 248, 0.15)",
          bg: "rgba(56, 189, 248, 0.03)"
        };
      case "seo":
        return {
          color: "var(--color-seo)",
          border: "rgba(167, 139, 250, 0.15)",
          bg: "rgba(167, 139, 250, 0.03)"
        };
      case "accessibility":
        return {
          color: "var(--color-accessibility)",
          border: "rgba(251, 191, 36, 0.15)",
          bg: "rgba(251, 191, 36, 0.03)"
        };
      case "mobile":
        return {
          color: "var(--color-mobile)",
          border: "rgba(244, 114, 182, 0.15)",
          bg: "rgba(244, 114, 182, 0.03)"
        };
      default:
        return {
          color: "var(--color-info)",
          border: "rgba(59, 130, 246, 0.15)",
          bg: "rgba(59, 130, 246, 0.03)"
        };
    }
  };

  const getScoreStatus = (val) => {
    if (val >= 90) return { label: "Excellent", class: "badge-success" };
    if (val >= 70) return { label: "Good", class: "badge-warning" };
    return { label: "Needs Work", class: "badge-danger" };
  };

  const styles = getCategoryStyles();
  const status = getScoreStatus(score);

  return (
    <div 
      className="card" 
      style={{ 
        borderLeft: `4px solid ${styles.color}`,
        borderColor: styles.border,
        backgroundColor: styles.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%"
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {title}
          </span>
          <span className={`badge ${status.class}`} style={{ fontSize: "0.7rem" }}>
            {status.label}
          </span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          {description}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
        <span style={{ fontSize: "2.5rem", fontWeight: "700", color: varStyle(score, styles.color) }}>
          {score}
        </span>
        <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: "500" }}>
          /100
        </span>
      </div>

      {/* Mini Progress Bar */}
      <div style={{ width: "100%", height: "4px", backgroundColor: "var(--bg-tertiary)", borderRadius: "2px", marginTop: "0.75rem", overflow: "hidden" }}>
        <div 
          style={{ 
            width: `${score}%`, 
            height: "100%", 
            backgroundColor: styles.color,
            borderRadius: "2px",
            transition: "width 0.8s ease-out" 
          }}
        />
      </div>
    </div>
  );
};

// Return red, orange or standard category color based on score level
const varStyle = (score, defaultColor) => {
  if (score < 50) return "var(--color-danger)";
  if (score < 70) return "var(--color-warning)";
  return "var(--text-primary)";
};

export default ScoreCard;
