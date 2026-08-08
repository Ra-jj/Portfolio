import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-scroll";
import gsap from "gsap";
import "./KineticNav.css";

const navLinks = [
  { name: "Home", target: "hero", number: "01" },
  { name: "Journey", target: "timeline", number: "02" },
  { name: "Skills", target: "skills", number: "03" },
  { name: "Projects", target: "projects", number: "04" },
  { name: "Contact", target: "contact", number: "05" },
];

const KineticNav = () => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for header background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP menu animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const overlay = containerRef.current.querySelector(".nav-fullscreen-overlay");
      const backdrop = containerRef.current.querySelector(".nav-overlay-backdrop");
      const panel = containerRef.current.querySelector(".nav-menu-panel");
      const bgPanels = containerRef.current.querySelectorAll(".nav-bg-panel");
      const links = containerRef.current.querySelectorAll(".nav-menu-link");
      const fadeTargets = containerRef.current.querySelectorAll("[data-menu-fade]");

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.6 },
      });

      if (isOpen) {
        // Lock body scroll
        document.body.style.overflow = "hidden";
        overlay.setAttribute("data-nav", "open");

        tl.set(overlay, { display: "block" })
          .fromTo(panel, { x: "100%" }, { x: "0%", duration: 0.6 })
          .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(
            bgPanels,
            { x: "101%" },
            { x: "0%", stagger: 0.1, duration: 0.5 },
            "<"
          )
          .fromTo(
            links,
            { yPercent: 140, rotate: 8 },
            { yPercent: 0, rotate: 0, stagger: 0.06, duration: 0.7 },
            "<+=0.25"
          );

        if (fadeTargets.length) {
          tl.fromTo(
            fadeTargets,
            { autoAlpha: 0, yPercent: 30 },
            { autoAlpha: 1, yPercent: 0, stagger: 0.04 },
            "<+=0.15"
          );
        }
      } else {
        // Unlock body scroll
        document.body.style.overflow = "";
        overlay.setAttribute("data-nav", "closed");

        tl.to(backdrop, { autoAlpha: 0, duration: 0.4 })
          .to(panel, { x: "100%", duration: 0.5 }, "<")
          .set(overlay, { display: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isOpen]);

  // Escape key handling
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // Shape hover animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const items = containerRef.current.querySelectorAll(".nav-menu-item[data-shape]");
      const shapesContainer = containerRef.current.querySelector(".nav-ambient-shapes");

      items.forEach((item) => {
        const idx = item.getAttribute("data-shape");
        const shape = shapesContainer?.querySelector(`.nav-shape-${idx}`);
        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".shape-el");

        const onEnter = () => {
          shapesContainer.querySelectorAll(".nav-shape").forEach((s) => s.classList.remove("active"));
          shape.classList.add("active");
          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.5, stagger: 0.06, ease: "back.out(1.7)", overwrite: "auto" }
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        item._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (containerRef.current) {
        containerRef.current.querySelectorAll(".nav-menu-item[data-shape]").forEach((item) => {
          item._cleanup && item._cleanup();
        });
      }
    };
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleNavClick = () => {
    // Small delay to let scroll start before closing overlay
    setTimeout(() => closeMenu(), 100);
  };

  return (
    <div ref={containerRef}>
      {/* ===== Fixed Header Bar ===== */}
      <header className={`kinetic-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <Link
            to="hero"
            smooth={true}
            duration={500}
            className="kinetic-logo"
          >
            Monodip<span className="accent-dot">.</span>
          </Link>

          {/* Desktop horizontal nav — visible on md+ */}
          <div className="desktop-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.target}
                smooth={true}
                duration={500}
                spy={true}
                activeClass="active-link"
                className="desktop-nav-link"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile/tablet hamburger — hidden on md+ */}
          <button
            className="menu-toggle-btn"
            data-open={isOpen}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="menu-toggle-label">{isOpen ? "Close" : "Menu"}</span>
            <div className="menu-icon-wrap">
              <span className="menu-icon-bar" />
              <span className="menu-icon-bar" />
              <span className="menu-icon-bar" />
            </div>
          </button>
        </div>
      </header>

      {/* ===== Fullscreen Navigation Overlay ===== */}
      <section className="nav-fullscreen-overlay" data-nav="closed">
        <div className="nav-overlay-backdrop" onClick={closeMenu} />

        <nav className="nav-menu-panel">
          {/* Staggered background panels */}
          <div className="nav-bg-panel" />
          <div className="nav-bg-panel" />
          <div className="nav-bg-panel" />

          {/* Ambient shapes */}
          <div className="nav-ambient-shapes">
            <svg className="nav-shape nav-shape-1" viewBox="0 0 400 400" fill="none">
              <circle className="shape-el" cx="80" cy="120" r="50" fill="rgba(56,189,248,0.12)" />
              <circle className="shape-el" cx="300" cy="80" r="70" fill="rgba(56,189,248,0.08)" />
              <circle className="shape-el" cx="200" cy="300" r="90" fill="rgba(56,189,248,0.06)" />
            </svg>
            <svg className="nav-shape nav-shape-2" viewBox="0 0 400 400" fill="none">
              <path className="shape-el" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(56,189,248,0.15)" strokeWidth="50" fill="none" />
              <path className="shape-el" d="M0 280 Q100 180, 200 280 T 400 280" stroke="rgba(56,189,248,0.08)" strokeWidth="35" fill="none" />
            </svg>
            <svg className="nav-shape nav-shape-3" viewBox="0 0 400 400" fill="none">
              <circle className="shape-el" cx="50" cy="50" r="8" fill="rgba(56,189,248,0.25)" />
              <circle className="shape-el" cx="150" cy="100" r="12" fill="rgba(56,189,248,0.2)" />
              <circle className="shape-el" cx="300" cy="80" r="6" fill="rgba(56,189,248,0.3)" />
              <circle className="shape-el" cx="100" cy="250" r="10" fill="rgba(56,189,248,0.2)" />
              <circle className="shape-el" cx="350" cy="300" r="8" fill="rgba(56,189,248,0.25)" />
              <circle className="shape-el" cx="200" cy="350" r="14" fill="rgba(56,189,248,0.15)" />
            </svg>
            <svg className="nav-shape nav-shape-4" viewBox="0 0 400 400" fill="none">
              <path className="shape-el" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(56,189,248,0.1)" />
              <path className="shape-el" d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill="rgba(56,189,248,0.07)" />
            </svg>
            <svg className="nav-shape nav-shape-5" viewBox="0 0 400 400" fill="none">
              <line className="shape-el" x1="0" y1="100" x2="300" y2="400" stroke="rgba(56,189,248,0.12)" strokeWidth="25" />
              <line className="shape-el" x1="100" y1="0" x2="400" y2="300" stroke="rgba(56,189,248,0.08)" strokeWidth="20" />
            </svg>
          </div>

          {/* Menu Content */}
          <div className="nav-menu-content">
            <ul className="nav-menu-list">
              {navLinks.map((link) => (
                <li key={link.name} className="nav-menu-item" data-shape={link.number.replace("0", "")}>
                  <Link
                    to={link.target}
                    smooth={true}
                    duration={600}
                    className="nav-menu-link"
                    onClick={handleNavClick}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="nav-bottom-section" data-menu-fade>
              <div className="nav-social-links">
                <a href="https://github.com/Ra-jj" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </nav>
      </section>
    </div>
  );
};

export default KineticNav;
