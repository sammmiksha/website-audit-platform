import React from "react";

const StrengthCard = ({ strength, category }) => {
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
        marginBottom: "0.75rem",
        padding: "1rem",
        borderLeft: `3px solid var(--color-success)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ color: "var(--color-success)", fontSize: "1.2rem", fontWeight: "700", display: "flex", alignItems: "center" }}>
          ✓
        </span>
        <p style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
          {strength}
        </p>
      </div>

      <span 
        style={{ 
          fontSize: "0.7rem", 
          fontWeight: "600", 
          padding: "0.15rem 0.4rem", 
          borderRadius: "4px",
          color: theme.color,
          backgroundColor: theme.bg,
          flexShrink: 0
        }}
      >
        {theme.label}
      </span>
    </div>
  );
};

export default StrengthCard;
