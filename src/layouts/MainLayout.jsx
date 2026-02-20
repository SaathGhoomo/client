import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>Header</div>
      </header>

      <main style={{ flex: 1, padding: 20, background: "#fafafa" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Outlet />
        </div>
      </main>

      <footer
        style={{
          padding: "16px 20px",
          borderTop: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>Footer</div>
      </footer>
    </div>
  );
}
