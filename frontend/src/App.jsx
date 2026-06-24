import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";

function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Simple navigation bar */}
        <header style={{ borderBottom: "1px solid var(--border-color)", padding: "1rem 1.5rem", backgroundColor: "var(--bg-secondary)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <a href="/" style={{ fontWeight: "700", fontSize: "1.15rem", color: "var(--text-primary)" }}>
              Website Audit Platform
            </a>
          </div>
        </header>

        {/* Main page content */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report/:id" element={<Report />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid var(--border-color)", padding: "1.5rem", textAlign: "center", backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p>© {new Date().getFullYear()} Website Audit Platform. Built with React & FastAPI.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
