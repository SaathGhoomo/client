import { useRef, useState } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthModal from "./AuthModal";
import ThreeHeartsBackground from "./ThreeHeartsBackground";

import Hero from "./sections/Hero";
import HowItWorks from "./sections/HowItWorks";
import Features from "./sections/Features";
import SaathCoins from "./sections/SaathCoins";
import Refer from "./sections/Refer";
import CTA from "./sections/CTA";

function getInitials(name) {
  return (
    name
      .split(" ")
      .map((n) => n?.[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
}

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("register");

  const flipTargetRef = useRef(null);
  const bgRef = useRef(null);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const closeAuth = () => setAuthOpen(false);

  const burst = () => {
    bgRef.current?.burst?.();
  };

  const onLogin = ({ name }) => {
    localStorage.setItem("accessToken", `local_${Date.now()}`);
    localStorage.setItem("userName", name);
    localStorage.setItem("sgLoggedUser", JSON.stringify({ name }));
    getInitials(name);
  };

  return (
    <>
      <ThreeHeartsBackground ref={bgRef} enableTrail={true} trailTargetRef={flipTargetRef} />

      <Navbar onOpenAuth={openAuth} />

      <div className="page">
        <Hero onOpenAuth={openAuth} />

        <section id="find-companions">
          <div className="section-wrap">
            <span className="s-tag">Coming Next</span>
            <h2 className="s-title">Find Companions</h2>
            <p className="s-sub">
              This section is reserved for your search + companion cards UI.
            </p>
          </div>
        </section>

        <HowItWorks />
        <Features />
        <SaathCoins />
        <Refer onOpenAuth={openAuth} />
        <CTA onOpenAuth={openAuth} />
      </div>

      <Footer />

      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={closeAuth}
        onLogin={onLogin}
        onModeChange={setAuthMode}
        onBurst={burst}
        flipTargetRef={flipTargetRef}
      />
    </>
  );
}
