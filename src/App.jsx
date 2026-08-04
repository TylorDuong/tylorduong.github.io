import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { C } from "@/lib/theme";
import { useCountUp } from "@/lib/util";
import { Navbar } from "@/layout/Navbar";
import { HudCorners, PaperGrain } from "@/components/Chrome";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Projects } from "@/sections/Projects";
import { Experience } from "@/sections/Experience";
import { Testimonials } from "@/sections/Testimonials";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { ProjectIndex } from "@/screens/ProjectIndex";
import { ProjectDetail } from "@/screens/ProjectDetail";
import { projects, testimonials, metrics as metricsData } from "@/data";

const NAV_OFFSET = 96;
const SECTION_ORDER = ["about", "projects", "experience", "testimonials", "contact"];

export default function App() {
  const [screen, setScreen] = useState("home"); // home | index | project
  const [projectIdx, setProjectIdx] = useState(0);
  const [tIdx, setTIdx] = useState(0);
  const [peopleExpanded, setPeopleExpanded] = useState(false);
  const [savedExpanded, setSavedExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [countKey, setCountKey] = useState(0); // bump to replay the count-up
  const pendingScroll = useRef(null); // section to scroll to after returning home

  // DOM nodes of the home sections, collected via callback refs so we never
  // read a ref during render (only in effects / handlers).
  const sectionEls = useRef({});
  const setSectionEl = useCallback((key) => (el) => {
    sectionEls.current[key] = el;
  }, []);

  const eased = useCountUp(countKey);

  // ---- navigation ----
  const performScroll = useCallback((key) => {
    if (key === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = sectionEls.current[key];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const scrollToSection = useCallback(
    (key) => {
      setMenuOpen(false);
      if (screen !== "home") {
        pendingScroll.current = key;
        setScreen("home");
        setCountKey((n) => n + 1);
        return;
      }
      performScroll(key);
    },
    [screen, performScroll]
  );

  const toScreen = useCallback((next, idx) => {
    setScreen(next);
    if (typeof idx === "number") setProjectIdx(idx);
    window.scrollTo(0, 0);
    if (next === "home") setCountKey((n) => n + 1);
  }, []);

  // After switching back to home, run the deferred scroll once mounted.
  useEffect(() => {
    if (screen !== "home" || !pendingScroll.current) return;
    const key = pendingScroll.current;
    pendingScroll.current = null;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => performScroll(key))
    );
    return () => cancelAnimationFrame(id);
  }, [screen, performScroll]);

  // Scroll-spy for the active nav link (home only).
  useEffect(() => {
    const onScroll = () => {
      if (screen !== "home") return;
      const probe = window.scrollY + NAV_OFFSET + 40;
      let active = "home";
      for (const key of SECTION_ORDER) {
        const el = sectionEls.current[key];
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (probe >= top) active = key;
        }
      }
      setActiveSection((prev) => (prev === active ? prev : active));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [screen]);

  // ---- derived data ----
  const derived = useMemo(() => {
    const all = projects.map((p, i) => ({
      ...p,
      no: String(i + 1).padStart(2, "0"),
      stack: p.tags.join(" · ").toUpperCase(),
      rowBg: i % 2 === 1 ? C.rowAlt : "transparent",
      open: () => toScreen("project", i),
    }));
    const personal = all.filter((p) => p.kind !== "enterprise");
    const enterprise = all.filter((p) => p.kind === "enterprise");
    const previewPersonal = personal.slice(0, 6);
    const previewEnterprise = enterprise.slice(0, 3);
    const moreCount = Math.max(all.length - (previewPersonal.length + previewEnterprise.length), 0);
    return {
      all,
      personal,
      enterprise,
      previewPersonal,
      previewEnterprise,
      unitCount: String(all.length).padStart(2, "0"),
      personalCount: String(personal.length).padStart(2, "0"),
      enterpriseCount: String(enterprise.length).padStart(2, "0"),
      seeAllLabel: moreCount > 0 ? `See All Projects (${moreCount} more)` : "See All Projects",
    };
  }, [toScreen]);

  const metrics = {
    peopleHelpedValue: Math.round(metricsData.peopleHelped * eased).toLocaleString("en-US") + "+",
    savedValue: "$" + Math.round(metricsData.moneySaved * eased).toLocaleString("en-US"),
    peopleHelpedBreakdown: metricsData.peopleHelpedBreakdown,
    savedBreakdown: metricsData.moneySavedBreakdown,
    peopleExpanded,
    savedExpanded,
    togglePeople: () => setPeopleExpanded((v) => !v),
    toggleSaved: () => setSavedExpanded((v) => !v),
  };

  const tCur = testimonials[tIdx] || testimonials[0];
  const tCounter =
    String(tIdx + 1).padStart(2, "0") + " / " + String(testimonials.length).padStart(2, "0");

  const pIdx = Math.min(projectIdx, projects.length - 1);
  const pCur = projects[pIdx] || {};
  const pCounter =
    "UNIT " + String(pIdx + 1).padStart(2, "0") + " OF " + String(projects.length).padStart(2, "0");

  const goIndex = () => toScreen("index");

  return (
    <div style={{ position: "relative", zIndex: 0, minHeight: "100vh", background: C.paper, color: C.ink, overflowX: "hidden" }}>
      <Navbar
        active={screen === "home" ? activeSection : null}
        go={scrollToSection}
        menuOpen={menuOpen}
        openMenu={() => setMenuOpen(true)}
        closeMenu={() => setMenuOpen(false)}
      />

      <HudCorners show />

      {screen === "home" && (
        <div>
          <Hero
            go={scrollToSection}
            goIndex={goIndex}
            metrics={metrics}
            unitCount={derived.unitCount}
            tickerDur="48s"
          />
          <About innerRef={setSectionEl("about")} />
          <Projects
            innerRef={setSectionEl("projects")}
            goIndex={goIndex}
            previewPersonal={derived.previewPersonal}
            previewEnterprise={derived.previewEnterprise}
            personalCount={derived.personalCount}
            enterpriseCount={derived.enterpriseCount}
            seeAllLabel={derived.seeAllLabel}
          />
          <Experience innerRef={setSectionEl("experience")} />
          <Testimonials
            innerRef={setSectionEl("testimonials")}
            t={tCur}
            counter={tCounter}
            onPrev={() => setTIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
            onNext={() => setTIdx((i) => (i + 1) % testimonials.length)}
          />
          <Contact innerRef={setSectionEl("contact")} goIndex={goIndex} />
        </div>
      )}

      {screen === "index" && (
        <ProjectIndex
          personalProjects={derived.personal}
          enterpriseProjects={derived.enterprise}
          personalCount={derived.personalCount}
          enterpriseCount={derived.enterpriseCount}
          unitCount={derived.unitCount}
        />
      )}

      {screen === "project" && (
        <ProjectDetail
          project={pCur}
          counter={pCounter}
          goIndex={goIndex}
          onPrev={() => toScreen("project", (pIdx - 1 + projects.length) % projects.length)}
          onNext={() => toScreen("project", (pIdx + 1) % projects.length)}
        />
      )}

      <Footer go={scrollToSection} />
      <PaperGrain opacity={0.6} />
    </div>
  );
}
