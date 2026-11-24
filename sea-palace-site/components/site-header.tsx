"use client";

import Link from "next/link";
import { useEffect, useRef, type MouseEvent } from "react";
import { isLanguage, restaurant, type Language, type RestaurantCopy } from "../lib/restaurant";
import { BookLink, Brand, Icon } from "./site-ui";

export const navigation = [
  { id: "inicio", number: "00", text: "home" },
  { id: "espaco", number: "01", text: "space" },
  { id: "carta", number: "02", text: "menu" },
  { id: "visita", number: "03", text: "visit" },
  { id: "avaliacoes", number: "04", text: "reviews" },
] as const;

export type SectionId = (typeof navigation)[number]["id"];

type HeaderProps = {
  copy: RestaurantCopy;
  language: Language;
  onLanguageChange: (language: Language) => void;
  menuOpen: boolean;
  onMenuChange: (open: boolean) => void;
  activeSection: SectionId;
  scrolled: boolean;
  showReviews: boolean;
  menuPage?: boolean;
};

function LanguageSelect({ copy, language, onLanguageChange }: Pick<HeaderProps, "copy" | "language" | "onLanguageChange">) {
  return (
    <label className="language relative inline-flex items-center">
      <select value={language} aria-label={copy.language} onChange={(event) => {
        if (isLanguage(event.target.value)) onLanguageChange(event.target.value);
      }}>
        <option value="pt" lang="pt">PT</option>
        <option value="en" lang="en">EN</option>
      </select>
      <Icon name="chevron" />
    </label>
  );
}

export function SiteHeader({
  copy, language, onLanguageChange, menuOpen, onMenuChange, activeSection, scrolled, showReviews, menuPage = false,
}: HeaderProps) {
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pendingAnchor = useRef<string>(null);
  const restoreFocus = useRef(false);
  const links = navigation.filter(({ id }) => showReviews || id !== "avaliacoes");

  function href(id: SectionId) {
    if (id === "carta") return restaurant.links.menu;
    return menuPage ? `/#${id}` : `#${id}`;
  }

  function current(id: SectionId) {
    if (activeSection !== id) return undefined;
    return menuPage ? "page" : "location";
  }

  function close(focusToggle = true) {
    restoreFocus.current = focusToggle;
    onMenuChange(false);
  }

  useEffect(() => {
    if (menuOpen) {
      const mobile = matchMedia("(max-width: 860px)");
      const previousFocus = document.activeElement;
      panel.current?.querySelector("a")?.focus();

      function onResize(event: MediaQueryListEvent) {
        if (event.matches) return;
        onMenuChange(false);
        if (header.current?.contains(previousFocus)) {
          header.current.querySelector<HTMLElement>(".brand")?.focus();
        }
      }

      function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          event.preventDefault();
          restoreFocus.current = true;
          onMenuChange(false);
          return;
        }
        if (event.key !== "Tab") return;

        const first = header.current?.querySelector<HTMLElement>(".brand");
        const last = panel.current?.querySelector("select");
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }

      mobile.addEventListener("change", onResize);
      document.addEventListener("keydown", onKeyDown);
      return () => {
        mobile.removeEventListener("change", onResize);
        document.removeEventListener("keydown", onKeyDown);
      };
    }

    if (pendingAnchor.current) {
      const hash = pendingAnchor.current;
      pendingAnchor.current = null;
      const section = document.getElementById(hash.slice(1));
      if (location.hash !== hash) history.pushState(null, "", hash);
      section?.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true });
      section?.scrollIntoView({ block: "start" });
    } else if (restoreFocus.current) {
      restoreFocus.current = false;
      toggle.current?.focus();
    }
  }, [menuOpen, onMenuChange]);

  function onAnchor(event: MouseEvent<HTMLElement>) {
    if (!menuOpen || !(event.target instanceof Element)) return;
    const link = event.target.closest("a");
    if (!link) return;
    if (link.hash && link.pathname === location.pathname && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      pendingAnchor.current = link.hash;
      close(false);
    } else {
      close();
    }
  }

  return (
    <header ref={header} className={`header${scrolled ? " is-scrolled" : ""}${menuOpen ? " is-open" : ""}`} onClick={onAnchor}>
      <div className="shell header-inner grid h-full items-center">
        <Brand href={href("inicio")} />
        <nav className="desktop-nav" aria-label={copy.mainNav}>
          {links.map(({ id, text }) => (
            <Link key={id} href={href(id)} prefetch={id === "carta" ? false : undefined} aria-current={current(id)}>{copy[text]}</Link>
          ))}
        </nav>
        <div className="header-actions items-center justify-end">
          <LanguageSelect copy={copy} language={language} onLanguageChange={onLanguageChange} />
          <BookLink outlined>{copy.book}</BookLink>
          <button
            ref={toggle}
            className="hamburger"
            type="button"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            onClick={() => menuOpen ? close() : onMenuChange(true)}
          >
            <span /><span />
          </button>
        </div>
      </div>
      <div className="mobile-overlay" aria-hidden="true" onClick={() => close()} />
      <div ref={panel} className="mobile-menu" id="mobile-menu" inert={!menuOpen}>
        <nav aria-label={copy.mainNav}>
          {links.map(({ id, text, number }) => (
            <Link key={id} href={href(id)} prefetch={id === "carta" ? false : undefined} aria-current={current(id)}>
              <span aria-hidden="true">{number}</span><span>{copy[text]}</span>
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-actions mt-[21px] flex items-center gap-[19px]">
          <BookLink>{copy.book}</BookLink>
          <LanguageSelect copy={copy} language={language} onLanguageChange={onLanguageChange} />
        </div>
      </div>
    </header>
  );
}
