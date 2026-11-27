import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { restaurant } from "../lib/restaurant";

const iconPaths = {
  right: <path d="M4 12h15m-6-6 6 6-6 6" />,
  external: <path d="M6 18 18 6M8 6h10v10" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  pin: <><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.3" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></>,
  phone: <path d="M8 4H5.5a1 1 0 0 0-1 1.1c.5 8 6.4 13.9 14.5 14.4a1 1 0 0 0 1-1V16l-4-2-1.7 1.5a13.4 13.4 0 0 1-5.8-5.8L10 8z" />,
  pause: <path d="M9 6v12m6-12v12" />,
  play: <path d="m9 6 9 6-9 6z" />,
};

export function Icon({ name }: { name: keyof typeof iconPaths }) {
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{iconPaths[name]}</svg>;
}

export function Brand({ href = "#inicio" }: { href?: string }) {
  return (
    <a className="brand inline-flex w-max items-center justify-self-start" href={href} aria-label="Sea Palace">
      <img className="brand-crest" src="/assets/brand/sea-palace-crest.webp" width={144} height={176} alt="" />
      <span className="brand-name">Sea Palace</span>
    </a>
  );
}

export function BookLink({ children, outlined = false }: { children: ReactNode; outlined?: boolean }) {
  return (
    <a className={outlined ? "button button-outline header-book" : "button button-primary"} href={restaurant.links.booking}>
      {children}
    </a>
  );
}

export function ExternalLink(props: ComponentPropsWithoutRef<"a">) {
  return <a target="_blank" rel="noopener" {...props} />;
}

export function SectionTitle({ id, children }: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2 className="section-title" id={id} tabIndex={-1}>
      {children}
    </h2>
  );
}

export function Photo({ name, width, height, alt, draggable }: {
  name: string;
  width: number;
  height: number;
  alt: string;
  draggable?: boolean;
}) {
  return (
    <img
      src={`/assets/${name}.webp`}
      width={width}
      height={height}
      alt={alt}
      draggable={draggable}
      loading="lazy"
      fetchPriority="low"
      decoding="async"
    />
  );
}
