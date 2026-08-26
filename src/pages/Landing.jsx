import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CARDS = [
  { img: "https://madeinmarseille.net/actualites-marseille/2019/04/Cube-campus-aix.jpeg", rotate: -10 },
  { img: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Ijba_iut_montaigne_bordeaux.jpg", rotate: -4 },
  { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Batiments_de_nuits_-Univ_Rennes_2_-_Louis_Arretche.jpg/330px-Batiments_de_nuits_-Univ_Rennes_2_-_Louis_Arretche.jpg", rotate: 3 },
  { img: "https://cdn-s-www.bienpublic.com/images/AC513A2C-88A9-456D-972D-758F6975A8A9/NW_raw/le-campus-dijonnais-de-l-universite-de-bourgogne-accueille-plus-de-30-000-etudiants-photo-d-illustration-lbp-emma-buoncristiani-1690820597.jpg", rotate: 9 },
];

const GAP_STATS = [
  { label: "Clear cost & scholarship info", value: 82 },
  { label: "Real admission chances", value: 71 },
  { label: "Side-by-side comparison", value: 47 },
];

const HEADLINE_WORDS = "82% want clearer info on costs & scholarships".split(" ");

const RESEARCH_VIDEO_SRC = encodeURI("/Unexa Research Film (1).mp4");

const LINKEDIN_URL =
  "https://www.linkedin.com/posts/anastasiia-andriievska-136244223_unexa-uiux-ui-ugcPost-7465337400106573825-TzxU/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEFKh8UBxAs6Av--VNalFnRJGMm8XyrIoQ0";

const LINKEDIN_COMPANY_URL = "https://www.linkedin.com/company/unexauni/?viewAsMember=true";

// ── Stacked sticky-scroll cards ──
// Each entry becomes one full-bleed pinned panel. STACK_TOP_BASE is
// where the first card pins (clear of the fixed nav pill). Each
// subsequent card pins STACK_PEEK px lower than the one before it,
// so the previous card is never fully hidden — only the top
// STACK_PEEK px of it stay visible as a sliver once the next card
// seals over it.
const STACK_TOP_BASE = 110;
const STACK_PEEK = 32;

const PROCESS_STEPS = [
  {
    key: "research",
    type: "video",
    src: encodeURI("/Screen Recording 2026-08-10 at 10.31.13.mov"),
    title: "Researching the space",
    text: "We studied how university and course-discovery sites look today, grouped by region — Canada, the UK, Korea — to see what actually works.",
  },
  {
    key: "references",
    type: "video",
    src: encodeURI("/Screen Recording 2026-08-10 at 10.31.35.mov"),
    title: "Collecting references",
    text: "We pulled together the layouts and UI patterns we liked most, to shape a direction for Unexa's own design.",
  },
  {
    key: "vibecoded",
    type: "image",
    src: encodeURI("/Screenshot 2026-08-10 at 10.32.46.png"),
    title: "From mockup to a live page",
    text: "After sketching the first mockup in Figma, we vibecoded it into a real, working homepage — search, filters, and university cards included.",
  },
];

const TEAM = [
  {
    key: "katia",
    photo: encodeURI("/IMG_2481 2.png"),
    name: "Kateryna Dmytrenko",
    linkedin: "https://www.linkedin.com/in/kateryna-dmytrenko-059a22266/",
  },
  {
    key: "anastasiia",
    photo: encodeURI("/photo_2026-08-11_19-37-08.png"),
    name: "Anastasiia Andriievska",
    linkedin: "https://www.linkedin.com/in/anastasiia-andriievska-136244223/",
  },
];

const NAV_ITEMS = [
  { id: "showcase", label: "About" },
  { id: "process", label: "Process" },
  { id: "team", label: "Team" },
];

const heySectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const heyInnerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
  },
};

const footerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const footerCtaVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
  },
};

const footerBottomRowVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
  },
};

function useSmoothScrollProgress() {
  const sectionRef = useRef(null);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    function updateTarget() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        targetRef.current = 1;
        return;
      }
      const raw = -rect.top / total;
      targetRef.current = Math.min(1, Math.max(0, raw));
    }

    function tick() {
      const diff = targetRef.current - currentRef.current;
      currentRef.current += diff * 0.09;
      if (Math.abs(diff) < 0.0005) {
        currentRef.current = targetRef.current;
      }
      setSmoothProgress(currentRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }

    updateTarget();
    const settleTimer = setTimeout(updateTarget, 300);

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      clearTimeout(settleTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return [sectionRef, smoothProgress];
}

function useDocScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}

function useCountUp(target, start, delay = 0, duration = 1000) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;

    let raf;
    let timeout;

    function animate() {
      let startTime = null;
      function step(ts) {
        if (startTime === null) startTime = ts;
        const p = Math.min(1, (ts - startTime) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * target));
        if (p < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }

    timeout = setTimeout(animate, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [start, target, delay, duration]);

  return display;
}

function GapStat({ label, value, start, delay }) {
  const display = useCountUp(value, start, delay);
  const barHeight = 150 + value * 1.5;

  return (
    <div className="research-zoom-stat-bar" style={{ height: `${barHeight}px` }}>
      <div className="research-zoom-stat-label">{label}</div>
      <div className="research-zoom-stat-value">{display}%</div>
    </div>
  );
}

// One stacked slide. No scroll math needed — the peek/seal effect is
// pure CSS (position: sticky + increasing top offset per index), so
// there's nothing here that can drift out of sync with the DOM.
function ProcessSlide({ step, index, total }) {
  const isLast = index === total - 1;
  const top = STACK_TOP_BASE + index * STACK_PEEK;

  return (
    <div className={`process-slide${isLast ? " is-last" : ""}`} style={{ zIndex: index + 1 }}>
      <div
        className="process-slide-sticky"
        style={{ top: `${top}px`, height: `calc(100vh - ${top}px)` }}
      >
        <div className="process-slide-panel">
          <div className="process-slide-text">
            <div className="landing-hero-eyebrow process-eyebrow">
              Our process <span className="process-slide-count">{index + 1} / {total}</span>
            </div>
            <h2 className="process-title">{step.title}</h2>
            <p className="process-desc">{step.text}</p>
            <div className="process-progress">
              {Array.from({ length: total }).map((_, i) => (
                <span key={i} className={`process-progress-dot${i === index ? " is-active" : ""}`} />
              ))}
            </div>
          </div>

          <div className="process-slide-media">
            {step.type === "video" ? (
              <video className="process-slide-media-el" src={step.src} autoPlay muted loop playsInline />
            ) : (
              <img className="process-slide-media-el" src={step.src} alt={step.title} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids.map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        const visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });
        if (visible.length) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
    return function () {
      observer.disconnect();
    };
  }, [ids]);

  return active;
}

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > threshold);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return function () {
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  return scrolled;
}

function NavLink({ item, isActive, onClick }) {
  const linkClass = isActive ? "landing-nav-link is-active" : "landing-nav-link";
  return (
    <a href={"#" + item.id} className={linkClass} onClick={onClick}>
      {item.label}
    </a>
  );
}

export default function Landing() {
  const [zoomRef, progress] = useSmoothScrollProgress();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const docProgress = useDocScrollProgress();
  const researchVideoRef = useRef(null);

  const navIds = NAV_ITEMS.map(function (n) {
    return n.id;
  });
  const activeSection = useActiveSection(navIds);
  const navScrolled = useScrolled();
  const navPillClass = `landing-nav-pill${navScrolled ? " is-scrolled" : ""}${mobileNavOpen ? " is-open" : ""}`;

  const eased = progress * progress * (3 - 2 * progress);
  const scale = 0.55 + eased * 0.7;
  const radius = 30 - eased * 10;

  const headingOpacity = Math.max(0, 1 - progress / 0.5);
  const folderOpacity = 1 - Math.max(0, (progress - 0.85) / 0.1);
  const textOpacity = Math.max(0, (progress - 0.93) / 0.07);

  const wordRevealFraction = Math.max(0, Math.min(1, (progress - 0.91) / 0.09));
  const revealedWordCount = Math.round(wordRevealFraction * HEADLINE_WORDS.length);

  useEffect(() => {
    const video = researchVideoRef.current;
    if (!video) return;

    if (progress > 0.02) {
      if (video.paused) {
        video.play().catch(() => {});
      }
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [progress]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeMobileNav() {
    setMobileNavOpen(false);
  }

  return (
    <div className="landing-page">
      <div className="scroll-progress-bar" style={{ transform: `scaleX(${docProgress})` }} />

      <header className="landing-nav">
        <div className={navPillClass}>
          <div className="landing-nav-top-row">
            <img src="/Unexa Logo.svg" alt="Unexa" className="landing-logo-img" />

            <nav className="landing-nav-links">
              {NAV_ITEMS.map(function (item) {
                return <NavLink key={item.id} item={item} isActive={activeSection === item.id} />;
              })}
            </nav>

            <a href="#launch" className="landing-nav-cta">
              Join waitlist <span aria-hidden="true">↗</span>
            </a>

            <button
              type="button"
              className={`landing-nav-hamburger${mobileNavOpen ? " is-open" : ""}`}
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileNavOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          <div className={`landing-nav-mobile-panel${mobileNavOpen ? " is-open" : ""}`}>
            <nav className="landing-nav-mobile-links">
              {NAV_ITEMS.map(function (item) {
                return (
                  <NavLink
                    key={item.id}
                    item={item}
                    isActive={activeSection === item.id}
                    onClick={closeMobileNav}
                  />
                );
              })}
              <a href="#launch" className="landing-nav-mobile-cta" onClick={closeMobileNav}>
                Join waitlist <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section className="landing-hero" id="showcase">
        <h1 className="landing-hero-title">
          Built for students still <span className="landing-hero-accent">✳</span>
          <br />
          figuring out where to study next
        </h1>
        <p className="landing-hero-desc">
          We're building a way to discover design & art programs across the world, compare them
          side by side, and plan every step — application deadlines, portfolio prep, and beyond.
        </p>
      </section>

      <section className="landing-cards-fan">
        {CARDS.map((c, i) => (
          <div key={c.img} className="landing-fan-card" style={{ "--rotate": `${c.rotate}deg`, "--delay": `${i * 0.15}s` }}>
            <img src={c.img} alt="" />
          </div>
        ))}
      </section>

      <section className="research-zoom-section" ref={zoomRef} id="research">
        <div className="research-zoom-sticky">
          <div className="research-zoom-fade">
            <div className="research-zoom-heading" style={{ opacity: headingOpacity }}>
              <div className="landing-hero-eyebrow research-eyebrow">User research</div>
              <h2 className="research-title">We asked. Students answered.</h2>
              <p className="research-sub">
                Before building further, we ran a short survey with design & art students on LinkedIn
                to understand what they actually struggle with when choosing a university.
              </p>
            </div>

            <div className="folder-visual" style={{ transform: `scale(${scale})`, borderRadius: `${radius}px`, opacity: folderOpacity }}>
              <div className="folder-back" />
              <div className="folder-video-slot">
                <video
                  className="folder-video"
                  src={RESEARCH_VIDEO_SRC}
                  ref={researchVideoRef}
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>
          </div>

          <div className="research-zoom-text" style={{ opacity: textOpacity }}>
            <div className="research-zoom-main">
              <div className="research-zoom-copy">
                <div className="landing-hero-eyebrow research-zoom-eyebrow">The biggest gap</div>
                <h2 className="research-zoom-title">
                  {HEADLINE_WORDS.map((word, i) => (
                    <span key={i} className={`reveal-word${i < revealedWordCount ? " is-revealed" : ""}`}>
                      {word}{" "}
                    </span>
                  ))}
                </h2>
                <p className="research-zoom-desc">
                  It's the single most-requested thing missing from university research today —
                  and exactly what we're building Unexa to solve.
                </p>
              </div>

              <div className="research-zoom-stats">
                {GAP_STATS.map((s, i) => (
                  <GapStat key={s.label} label={s.label} value={s.value} start={textOpacity > 0.05} delay={i * 220} />
                ))}
              </div>
            </div>

            <a className="linkedin-card" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <div className="linkedin-card-name">Anastasiia Andriievska</div>
              <span className="linkedin-card-cta">
                View post <span className="linkedin-card-arrow" aria-hidden="true">↗</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="process-stack" id="process">
        {PROCESS_STEPS.map((step, i) => (
          <ProcessSlide key={step.key} step={step} index={i} total={PROCESS_STEPS.length} />
        ))}
      </section>

      <motion.section
        className="hey-section"
        id="team"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={heySectionVariants}
      >
        <motion.div className="hey-inner" variants={heyInnerVariants}>
          <div className="hey-left">
            <h2 className="hey-title">Hey!</h2>
            <p className="hey-lead">
              We're Kateryna & Anastasiia, the two designers building Unexa.
            </p>
            <div className="hey-body">
              <p>
                Unexa started because we couldn't find a good way to compare design & art university
                programs across Europe. So we set out to build the tool we wished existed.
              </p>
              <p>
                From the first Figma sketch to the working homepage you've been scrolling through,
                this project has been the two of us — designing, researching, and building it together.
              </p>
            </div>
          </div>

          <div className="hey-photos">
            {TEAM.map((member) => (
              <div className="hey-photo-card" key={member.key}>
                <div className="hey-photo">
                  <img src={member.photo} alt={member.name} />
                </div>
                <div className="hey-photo-name">{member.name.split(" ")[0]}</div>
                <a className="hey-photo-link" href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  See on LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      <motion.footer
        className="landing-footer"
        id="launch"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={footerVariants}
      >
        <div className="footer-top-row">
          <div className="footer-copyright">
            <span aria-hidden="true">©</span> 2026
          </div>
          <button type="button" className="footer-backtotop" onClick={scrollToTop}>
            BACK TO TOP <span className="footer-backtotop-btn" aria-hidden="true">↑</span>
          </button>
        </div>

        <motion.div className="footer-cta" variants={footerCtaVariants}>
          <div className="footer-cta-eyebrow">Coming soon</div>
          <h2 className="footer-cta-title">Don't miss our launch</h2>
          <p className="footer-cta-desc">
            We're still building — follow along on LinkedIn to see progress and be the first to know when Unexa goes live.
          </p>
        </motion.div>

        <motion.div className="footer-bottom-row" variants={footerBottomRowVariants}>
          <div className="footer-pills">
            <a className="footer-pill" href={LINKEDIN_COMPANY_URL} target="_blank" rel="noopener noreferrer">Unexa</a>
            <a className="footer-pill" href={TEAM[0].linkedin} target="_blank" rel="noopener noreferrer">Kateryna</a>
            <a className="footer-pill" href={TEAM[1].linkedin} target="_blank" rel="noopener noreferrer">Anastasiia</a>
          </div>
          <div className="footer-credit">Built by Kateryna & Anastasiia</div>
        </motion.div>
      </motion.footer>
    </div>
  );
}