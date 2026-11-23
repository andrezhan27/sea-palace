"use client";

import { useEffect, useRef, useState } from "react";
import { isLanguage, restaurant, type Language } from "../lib/restaurant";
import { SiteHeader, navigation, type SectionId } from "./site-header";
import { Footer, Hero, MenuSection, ReviewsSection, SpaceSection, VisitSection } from "./restaurant-sections";
import { BookLink } from "./site-ui";

type ScrollState = { scrolled: boolean; pastHero: boolean; activeSection: SectionId };

const storageKey = "sea-palace-language";
const showReviews = restaurant.reviews.enabled && restaurant.reviews.items.length > 0;

export function RestaurantPage({ year }: { year: number }) {
  const [language, setLanguage] = useState<Language>("pt");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scroll, setScroll] = useState<ScrollState>({ scrolled: false, pastHero: false, activeSection: "inicio" });
  const page = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLElement>(null);
  const copy = restaurant.copy[language];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (isLanguage(saved)) setLanguage(saved);
    } catch {
      // The switch still works when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    document.documentElement.lang = copy.locale;
    document.title = copy.title;
    if (description) description.content = copy.description;
    return () => {
      document.documentElement.lang = restaurant.copy.pt.locale;
    };
  }, [copy]);

  useEffect(() => {
    const root = page.current;
    const header = root?.querySelector("header");
    const hero = root?.querySelector("#inicio");
    if (!root || !header || !hero) return;
    const headerElement = header;
    const heroElement = hero;

    const sections = navigation.flatMap(({ id }) => {
      const section = document.getElementById(id);
      return section ? [{ id, section }] : [];
    });
    let frame = 0;
    function update() {
      frame = 0;
      const headerHeight = headerElement.offsetHeight;
      const next = {
        scrolled: window.scrollY > 0,
        pastHero: heroElement.getBoundingClientRect().bottom <= headerHeight + 22,
        activeSection: sections.findLast(({ section }) => section.getBoundingClientRect().top <= headerHeight + 40)?.id ?? "inicio",
      };

      setScroll((current) =>
        current.scrolled === next.scrolled && current.pastHero === next.pastHero && current.activeSection === next.activeSection
          ? current
          : next,
      );
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = content.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const reveal = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.classList.add("is-visible");
        reveal.unobserve(target);
      }
    }, { threshold: 0.1 });

    // Animate upcoming sections while leaving already visible content readable during hydration.
    root.querySelectorAll("[data-reveal]").forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) element.classList.add("is-visible");
      else reveal.observe(element);
    });
    root.classList.add("reveal-ready");
    return () => {
      reveal.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  function updateLanguage(next: Language) {
    setLanguage(next);
    try { localStorage.setItem(storageKey, next); } catch { /* Storage is optional. */ }
  }

  return (
    <div ref={page} className={scroll.pastHero ? "past-hero" : undefined}>
      <a className="skip-link" href="#espaco" inert={menuOpen}>{copy.skip}</a>
      <SiteHeader
        copy={copy}
        language={language}
        onLanguageChange={updateLanguage}
        menuOpen={menuOpen}
        onMenuChange={setMenuOpen}
        scrolled={scroll.scrolled}
        activeSection={scroll.activeSection}
        showReviews={showReviews}
      />

      <main ref={content} id="conteudo" inert={menuOpen}>
        <Hero copy={copy} />
        <SpaceSection copy={copy} />
        <MenuSection copy={copy} language={language} />
        <VisitSection copy={copy} />
        {showReviews && <ReviewsSection copy={copy} />}
      </main>

      <Footer copy={copy} language={language} year={year} showReviews={showReviews} inert={menuOpen} />
      <div className="floating-book" inert={menuOpen}>
        <BookLink>{copy.book}</BookLink>
      </div>
    </div>
  );
}
