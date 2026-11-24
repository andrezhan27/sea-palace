"use client";

import { useEffect, useRef, useState } from "react";
import { restaurant } from "../lib/restaurant";
import type { RestaurantPolicies } from "../lib/restaurant-policies";
import { useLanguage } from "./use-language";
import { SiteHeader, navigation, type SectionId } from "./site-header";
import { Footer, Hero, MenuSection, ReviewsSection, SpaceSection, VisitSection } from "./restaurant-sections";
import { BookLink } from "./site-ui";

type ScrollState = { scrolled: boolean; pastHero: boolean; activeSection: SectionId };

const showReviews = restaurant.reviews.enabled && restaurant.reviews.items.length > 0;
const initialScroll: ScrollState = { scrolled: false, pastHero: false, activeSection: "inicio" };

export function RestaurantPage({ year, policies }: { year: number; policies: RestaurantPolicies }) {
  const { language, copy, updateLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scroll, setScroll] = useState(initialScroll);
  const page = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    document.title = copy.title;
    if (description) description.content = copy.description;
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
    let headerHeight = 0;
    let heroBottom = 0;
    let sectionPositions: { id: SectionId; top: number }[] = [];
    let current = initialScroll;

    function update() {
      const y = window.scrollY;
      const next = {
        scrolled: y > 0,
        pastHero: heroBottom <= y + headerHeight + 22,
        activeSection: sectionPositions.findLast(({ top }) => top <= y + headerHeight + 40)?.id ?? "inicio",
      };

      if (current.scrolled === next.scrolled && current.pastHero === next.pastHero && current.activeSection === next.activeSection) return;
      current = next;
      setScroll(next);
    }

    function measure() {
      const y = window.scrollY;
      headerHeight = headerElement.offsetHeight;
      heroBottom = heroElement.getBoundingClientRect().bottom + y;
      sectionPositions = sections.map(({ id, section }) => ({ id, top: section.getBoundingClientRect().top + y }));
      update();
    }

    const resize = new ResizeObserver(measure);
    resize.observe(headerElement);
    sections.forEach(({ section }) => resize.observe(section));
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
    };
  }, []);

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

      <main id="conteudo" inert={menuOpen}>
        <Hero copy={copy} />
        <div className="restaurant-sections">
          <SpaceSection copy={copy} language={language} />
          <MenuSection copy={copy} language={language} />
          <VisitSection copy={copy} />
          {showReviews && <ReviewsSection copy={copy} />}
        </div>
      </main>

      <Footer copy={copy} language={language} year={year} policies={policies} showReviews={showReviews} inert={menuOpen} />
      <div className="floating-book" inert={menuOpen}>
        <BookLink>{copy.book}</BookLink>
      </div>
    </div>
  );
}
