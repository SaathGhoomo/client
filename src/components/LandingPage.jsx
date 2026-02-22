import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRocket, FaGlobe } from 'react-icons/fa';

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

export default function LandingPage() {
  const navigate = useNavigate();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("register");

  const flipTargetRef = useRef(null);
  const bgRef = useRef(null);

  const openAuth = (mode) => {
    if (mode === "login") {
      navigate("/signin");
      return;
    }

    navigate("/signup");
  };

  const closeAuth = () => setAuthOpen(false);

  const burst = () => {
    bgRef.current?.burst?.();
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
        onLogin={() => {}}
        onModeChange={setAuthMode}
        onBurst={burst}
        flipTargetRef={flipTargetRef}
      />
    </>
  );
}
