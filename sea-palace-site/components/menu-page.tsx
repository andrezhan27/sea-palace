"use client";

import { useEffect, useRef, useState } from "react";
import { menuCategories } from "../lib/menu-categories";
import { restaurant } from "../lib/restaurant";
import type { RestaurantPolicies } from "../lib/restaurant-policies";
import { Footer } from "./restaurant-sections";
import { SiteHeader } from "./site-header";
import { ExternalLink } from "./site-ui";
import { MenuCategoryPicker, MenuDishCard } from "./menu-ui";
import { useLanguage } from "./use-language";

const showReviews = restaurant.reviews.enabled && restaurant.reviews.items.length > 0;

export function MenuPage({ year, policies }: { year: number; policies: RestaurantPolicies }) {
  const { language, copy, updateLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const categoryNav = useRef<HTMLElement>(null);
  const sidebar = useRef<HTMLUListElement>(null);
  const content = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = `${copy.menuTitle} · Sea Palace`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = copy.menuCopy;
  }, [copy]);

  useEffect(() => {
    const sections = Array.from(content.current?.querySelectorAll<HTMLElement>(".menu-category-section") ?? []);
    const mobile = matchMedia("(max-width: 860px)");
    const nav = categoryNav.current;
    if (!nav) return;
    let frame = 0;

    function update() {
      frame = 0;
      const headerHeight = document.querySelector<HTMLElement>(".header")?.offsetHeight ?? 0;
      const offset = headerHeight + (mobile.matches ? nav!.offsetHeight : 0) + 48;
      const current = sections.findLast((section) => section.getBoundingClientRect().top <= offset);
      setActiveCategory(current?.id ?? menuCategories[0].id);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const list = sidebar.current;
    const current = list?.querySelector<HTMLElement>('a[aria-current="location"]');
    if (!list || !current || !list.clientHeight) return;

    const item = current.getBoundingClientRect();
    const viewport = list.getBoundingClientRect();
    if (item.top < viewport.top) list.scrollTop -= viewport.top - item.top;
    if (item.bottom > viewport.bottom) list.scrollTop += item.bottom - viewport.bottom;
  }, [activeCategory]);

  function jumpToCategory(id: string) {
    const section = document.getElementById(id);
    if (!section) return;
    if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
    setActiveCategory(id);
    section.scrollIntoView({ block: "start", behavior: "instant" });
  }

  return (
    <div className="menu-route">
      <a className="skip-link" href="#menu-title" inert={menuOpen}>{copy.skip}</a>
      <SiteHeader
        copy={copy}
        language={language}
        onLanguageChange={updateLanguage}
        menuOpen={menuOpen}
        onMenuChange={setMenuOpen}
        scrolled
        activeSection="carta"
        showReviews={showReviews}
        menuPage
      />

      <main ref={content} className="shell menu-main" inert={menuOpen}>
        <div className="menu-heading">
          <div>
            <h1 id="menu-title" tabIndex={-1}>{copy.menuTitle}</h1>
            <p>{copy.menuCopy}</p>
          </div>
          <ExternalLink className="button button-primary" href={restaurant.links.menuPdf}>
            {copy.fullMenu}
          </ExternalLink>
        </div>

        <div className="menu-browser">
          <nav ref={categoryNav} className="menu-category-nav" aria-label={copy.menuCategories}>
            <p className="menu-category-label">{copy.menuCategories}</p>
            <ul ref={sidebar} className="menu-category-links">
              {menuCategories.map((category) => (
                <li key={category.id}>
                  <a href={`#${category.id}`} aria-current={activeCategory === category.id ? "location" : undefined}>
                    {category[language]}
                  </a>
                </li>
              ))}
            </ul>
            <MenuCategoryPicker label={copy.menuCategories} language={language} value={activeCategory} onChange={jumpToCategory} />
          </nav>

          <div className="menu-categories">
            {menuCategories.map((category) => (
              <section className="menu-category-section" id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
                <h2 id={`${category.id}-title`}>{category[language]}</h2>
                <div className="menu-dishes">
                  {category.dishes.map((dish, index) => (
                    <MenuDishCard key={dish[0]} dish={dish} language={language} eager={category.id === menuCategories[0].id && index < 3} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer copy={copy} language={language} year={year} policies={policies} showReviews={showReviews} inert={menuOpen} menuPage />
    </div>
  );
}
