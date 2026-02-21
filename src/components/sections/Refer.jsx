import { useState } from "react";

export default function Refer({ onOpenAuth }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText("SAATH2025");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="refer">
      <div className="section-wrap" style={{ textAlign: "center" }}>
        <span className="s-tag">Refer &amp; Earn</span>

        <div className="refer-card">
          <p style={{ fontSize: "0.83rem", color: "rgba(255,180,200,0.55)" }}>
            Share the joy of companionship
          </p>
          <div className="refer-big">₹500 per Referral</div>
          <p className="refer-sub">
            Invite friends to Saath Ghoomo. When they complete their first
            booking, you both earn SaathCoins worth ₹500.
          </p>
          <div className="refer-code">
            SAATH2025
            <button className="refer-copy" onClick={copy} type="button">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            className="btn-hero btn-hero-primary"
            onClick={() => onOpenAuth?.("register")}
            type="button"
          >
            Claim Your Code ✦
          </button>
        </div>
      </div>
    </section>
  );
}
