import React, { useState } from "react";

const AuditSection = ({ details }) => {
  const [activeSubTab, setActiveSubTab] = useState("headings");

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="card" style={{ marginTop: "1.5rem" }}>
      <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
        Extracted Webpage Structure
      </h3>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1px", marginBottom: "1.25rem" }}>
        {["headings", "images", "links", "metadata"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            style={{
              padding: "0.5rem 1rem",
              background: "none",
              border: "none",
              borderBottom: activeSubTab === tab ? "2px solid var(--border-focus)" : "2px solid transparent",
              color: activeSubTab === tab ? "var(--text-primary)" : "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600",
              textTransform: "capitalize",
              outline: "none"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content based on Active Sub-Tab */}
      {activeSubTab === "headings" && (
        <div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Heading tags establish the structure of the document. Standard SEO practice requires a single H1 tag followed sequentially by H2, H3 tags, etc.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const hList = details.headings?.[`h${num}`] || [];
              return (
                <div key={num} style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: hList.length > 0 ? "0.5rem" : "0" }}>
                    <span style={{ fontWeight: "600", color: num === 1 ? "var(--color-seo)" : "var(--text-primary)", fontSize: "0.9rem" }}>
                      H{num} Tag ({hList.length})
                    </span>
                  </div>
                  {hList.length > 0 ? (
                    <ul style={{ listStyleType: "none", paddingLeft: "0.5rem" }}>
                      {hList.map((text, idx) => (
                        <li key={idx} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", borderLeft: "2px solid var(--border-color)", paddingLeft: "0.5rem", margin: "0.25rem 0" }}>
                          {text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>No H{num} headings found.</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === "images" && (
        <div>
          <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem", backgroundColor: "var(--bg-primary)", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Images</span>
              <p style={{ fontSize: "1.25rem", fontWeight: "700" }}>{details.images?.total || 0}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Missing Alt Text</span>
              <p style={{ fontSize: "1.25rem", fontWeight: "700", color: details.images?.missing_alt_count > 0 ? "var(--color-danger)" : "var(--color-success)" }}>
                {details.images?.missing_alt_count || 0}
              </p>
            </div>
          </div>

          <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-tertiary)", textAlign: "left", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "0.5rem 0.75rem" }}>Image URL</th>
                  <th style={{ padding: "0.5rem 0.75rem" }}>Alt Text Description</th>
                  <th style={{ padding: "0.5rem 0.75rem", width: "100px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {details.images?.list && details.images.list.length > 0 ? (
                  details.images.list.map((img, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                      <td style={{ padding: "0.5rem 0.75rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>
                        <a href={img.src} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem" }}>
                          {img.src ? (img.src.length > 60 ? img.src.substring(0, 60) + "..." : img.src) : "Empty Src"}
                        </a>
                      </td>
                      <td style={{ padding: "0.5rem 0.75rem", color: img.alt ? "var(--text-primary)" : "var(--text-muted)", fontStyle: img.alt ? "normal" : "italic" }}>
                        {img.alt || "Alt attribute is missing/empty"}
                      </td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>
                        {img.alt ? (
                          <span style={{ color: "var(--color-success)" }}>✓ Valid</span>
                        ) : (
                          <span style={{ color: "var(--color-danger)", fontWeight: "500" }}>✗ Missing</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
                      No images found on page.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === "links" && (
        <div>
          <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem", backgroundColor: "var(--bg-primary)", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Internal Links</span>
              <p style={{ fontSize: "1.25rem", fontWeight: "700" }}>{details.links?.internal_count || 0}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>External Links</span>
              <p style={{ fontSize: "1.25rem", fontWeight: "700" }}>{details.links?.external_count || 0}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Broken Links (Sampled)</span>
              <p style={{ fontSize: "1.25rem", fontWeight: "700", color: details.links?.broken_count > 0 ? "var(--color-danger)" : "var(--color-success)" }}>
                {details.links?.broken_count || 0}
              </p>
            </div>
          </div>

          <h4 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>Homepage Link Sample Verifications</h4>
          <div style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-tertiary)", textAlign: "left", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "0.5rem 0.75rem" }}>Target Link URL</th>
                  <th style={{ padding: "0.5rem 0.75rem", width: "120px" }}>Link Type</th>
                  <th style={{ padding: "0.5rem 0.75rem", width: "100px" }}>HTTP Code</th>
                  <th style={{ padding: "0.5rem 0.75rem", width: "100px" }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {details.links?.tested && details.links.tested.length > 0 ? (
                  details.links.tested.map((lnk, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                      <td style={{ padding: "0.5rem 0.75rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>
                        <a href={lnk.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem" }}>
                          {lnk.url}
                        </a>
                      </td>
                      <td style={{ padding: "0.5rem 0.75rem", color: "var(--text-muted)" }}>
                        {lnk.is_internal ? "Internal" : "External"}
                      </td>
                      <td style={{ padding: "0.5rem 0.75rem", fontWeight: "500", color: lnk.is_broken ? "var(--color-danger)" : "var(--color-success)" }}>
                        {lnk.status_code || "Error"}
                      </td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>
                        {lnk.is_broken ? (
                          <span className="badge badge-danger" style={{ fontSize: "0.65rem" }}>Broken</span>
                        ) : (
                          <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>Active</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
                      No homepage links were tested.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === "metadata" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Page Title Tag</span>
            <p style={{ fontSize: "0.95rem", backgroundColor: "var(--bg-primary)", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)", marginTop: "0.25rem" }}>
              {details.title || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>None</span>}
            </p>
          </div>

          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Meta Description Tag</span>
            <p style={{ fontSize: "0.95rem", backgroundColor: "var(--bg-primary)", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)", marginTop: "0.25rem" }}>
              {details.meta_description || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>None</span>}
            </p>
          </div>

          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Canonical URL Tag</span>
            <p style={{ fontSize: "0.95rem", backgroundColor: "var(--bg-primary)", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)", marginTop: "0.25rem", wordBreak: "break-all" }}>
              {details.canonical_url || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>None</span>}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "0.5rem" }}>
            <div style={{ backgroundColor: "var(--bg-primary)", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Page Load Time</span>
              <p style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.15rem" }}>{details.load_time_seconds} seconds</p>
            </div>
            
            <div style={{ backgroundColor: "var(--bg-primary)", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>HTML Page Size</span>
              <p style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.15rem" }}>{formatBytes(details.page_size_bytes || 0)}</p>
            </div>

            <div style={{ backgroundColor: "var(--bg-primary)", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>External Stylesheets</span>
              <p style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.15rem" }}>{details.stylesheet_count} files</p>
            </div>

            <div style={{ backgroundColor: "var(--bg-primary)", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>External JavaScripts</span>
              <p style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.15rem" }}>{details.script_count} files</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditSection;
