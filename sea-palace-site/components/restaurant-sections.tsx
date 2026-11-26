import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { spacePhotos } from "../lib/space-photos";
import type { RestaurantPolicies } from "../lib/restaurant-policies";
import { restaurant, type Language, type RestaurantCopy } from "../lib/restaurant";
import { Carousel } from "./carousel";
import { MenuPreview } from "./menu-preview";
import { BookLink, Brand, ExternalLink, Icon, Photo, SectionTitle } from "./site-ui";

function StorefrontPicture({ className, alt, isHero = false }: {
  className?: string;
  alt: string;
  isHero?: boolean;
}) {
  const desktop = isHero ? "hero-dusk" : "hero-desktop";
  const sizes = isHero ? "100vw" : "(max-width: 600px) calc(100vw - 40px), (max-width: 1050px) calc(100vw - 60px), (max-width: 1420px) calc(100vw - 100px), 1320px";

  return (
    <picture className={className}>
      <source
        media="(max-width: 600px)"
        type="image/avif"
        srcSet="/assets/hero-mobile-480.avif 480w, /assets/hero-mobile-720.avif 720w, /assets/hero-mobile-941.avif 941w"
        sizes={sizes}
      />
      <source
        media="(max-width: 600px)"
        type="image/webp"
        srcSet="/assets/hero-mobile-480.webp 480w, /assets/hero-mobile-720.webp 720w, /assets/hero-mobile-941.webp 941w"
        sizes={sizes}
      />
      <source
        type="image/avif"
        srcSet={`/assets/${desktop}-960.avif 960w, /assets/${desktop}-1672.avif 1672w`}
        sizes={sizes}
      />
      <img
        src={`/assets/${desktop}-1672.webp`}
        srcSet={`/assets/${desktop}-960.webp 960w, /assets/${desktop}-1672.webp 1672w`}
        sizes={sizes}
        width={1672}
        height={941}
        alt={alt}
        loading={isHero ? "eager" : "lazy"}
        fetchPriority={isHero ? "high" : undefined}
        decoding={isHero ? undefined : "async"}
      />
    </picture>
  );
}

export function Hero({ copy }: { copy: RestaurantCopy }) {
  return (
    <section className="hero relative isolate grid" id="inicio" aria-labelledby="hero-title">
      <StorefrontPicture className="hero-photo" alt={copy.heroAlt} isHero />
      <img className="hero-crest" src="/assets/brand/sea-palace-crest.webp" width={144} height={176} alt="" />
      <div className="hero-content">
        <p className="hero-location eyebrow">{copy.heroLocation}</p>
        <h1 id="hero-title" tabIndex={-1}>
          Sea Palace <span className="hero-chinese" lang="zh-Hant">海上天</span>
        </h1>
        <p className="hero-cuisine">{copy.heroCuisine}</p>
      </div>
      <div className="hero-actions flex flex-wrap items-center">
        <BookLink>{copy.book}</BookLink>
        <Link className="button button-outline hero-menu-link" href={restaurant.links.menu} prefetch={false}>
          {copy.viewMenu}<Icon name="right" />
        </Link>
      </div>
    </section>
  );
}

const smallSpacePhotos = new Set(["space-2", "space-5", "space-8", "space-10"]);
const mobileSpacePhotoSize = "(max-width: 600px) calc((100vw - 48px) / 2), (max-width: 760px) calc((100vw - 68px) / 2)";

export function SpaceSection({ copy, language }: { copy: RestaurantCopy; language: Language }) {
  return (
    <section className="section" id="espaco" aria-labelledby="space-title">
      <div className="shell section-head grid">
        <SectionTitle id="space-title">{copy.spaceTitle}</SectionTitle>
        <p>{copy.spaceCopy}</p>
      </div>
      <div className="shell space-mosaic">
        {spacePhotos.map((photo) => {
          const small = smallSpacePhotos.has(photo.name);
          const desktopSize = small ? "(max-width: 1420px) 13vw, 177px" : "(max-width: 1420px) 27vw, 368px";

          return (
            <figure className={small ? "photo space-photo" : "photo space-photo space-photo-large"} key={photo.name}>
              <Photo
                name={`space/${photo.name}`}
                widths={[480, 960]}
                sizes={`${mobileSpacePhotoSize}, ${desktopSize}`}
                width={960}
                height={720}
                alt={photo[language]}
              />
            </figure>
          );
        })}
      </div>
    </section>
  );
}

export function MenuSection({ copy, language }: { copy: RestaurantCopy; language: Language }) {
  return (
    <section className="section" id="carta" aria-labelledby="menu-title">
      <div className="shell section-head grid">
        <SectionTitle id="menu-title">{copy.menuTitle}</SectionTitle>
        <div>
          <p>{copy.menuCopy}</p>
          <div className="text-links flex flex-wrap">
            <Link className="button button-primary" href={restaurant.links.menu} prefetch={false}>{copy.viewMenu}</Link>
            <ExternalLink className="text-link" href={restaurant.links.menuPdf}>{copy.fullMenu}</ExternalLink>
          </div>
        </div>
      </div>

      <MenuPreview copy={copy} language={language} />
    </section>
  );
}

function VisitMap({ copy }: { copy: RestaurantCopy }) {
  const map = useRef<HTMLDivElement>(null);
  const [loadMap, setLoadMap] = useState(false);
  const { links } = restaurant;

  useEffect(() => {
    if (!map.current || !("IntersectionObserver" in window)) {
      setLoadMap(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setLoadMap(true);
    }, { rootMargin: "200px 0px" });

    observer.observe(map.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={map} className="map relative overflow-hidden">
      {loadMap && (
        <iframe
          className="size-full border-0"
          title={copy.mapTitle}
          width={1320}
          height={345}
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          src={links.map}
        />
      )}
      <ExternalLink className="button button-map" href={links.directions}>
        <span>{copy.directions}</span><Icon name="external" />
      </ExternalLink>
    </div>
  );
}

export function VisitSection({ copy }: { copy: RestaurantCopy }) {
  const { links, contact } = restaurant;

  return (
    <section className="section" id="visita" aria-labelledby="visit-title">
      <div className="visit shell">
        <SectionTitle id="visit-title">{copy.visitTitle}</SectionTitle>
        <div className="visit-grid grid items-center">
          <figure className="photo visit-photo">
            <Photo
              name="contact-section"
              widths={[720, 1280]}
              sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 760px) calc(100vw - 60px), (max-width: 1420px) 48vw, 660px"
              width={1280}
              height={825}
              alt={copy.venueAlt}
            />
          </figure>
          <div className="visit-info">
            <p className="visit-intro">{copy.visitCopy}</p>
            <dl className="visit-list">
              <div>
                <dt><Icon name="pin" /><span>{copy.address}</span></dt>
                <dd>
                  <ExternalLink href={links.directions}>
                    {contact.street}<br />{contact.city} <Icon name="external" />
                  </ExternalLink>
                </dd>
              </div>
              <div>
                <dt><Icon name="clock" /><span>{copy.hours}</span></dt>
                <dd>{copy.daily}<br />{contact.hours}</dd>
              </div>
              <div>
                <dt><Icon name="phone" /><span>{copy.contact}</span></dt>
                <dd><a href={links.phone}>{contact.phone}</a></dd>
              </div>
            </dl>
            <BookLink>{copy.book}</BookLink>
            <p className="booking-note">{copy.bookNote}</p>
          </div>
        </div>
        <VisitMap copy={copy} />
      </div>
    </section>
  );
}

function GoogleMark() {
  return (
    <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.6h3.2c1.9-1.8 3-4.4 3-7.5Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.3l-3.2-2.6c-.9.6-2.1.9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z" />
      <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.5l3.3 2.6A5.9 5.9 0 0 1 12 6Z" />
    </svg>
  );
}

export function ReviewsSection({ copy }: { copy: RestaurantCopy }) {
  const { reviews } = restaurant;
  const numbers = new Intl.NumberFormat(copy.locale);
  const rating = reviews.rating == null ? null : numbers.format(reviews.rating);

  return (
    <section className="section reviews" id="avaliacoes" aria-labelledby="reviews-title">
      <div className="shell">
        <SectionTitle id="reviews-title">{copy.reviewsTitle}</SectionTitle>
        <div className="review-feature relative">
          <figure className="photo review-photo">
            <StorefrontPicture alt="" />
          </figure>
          {rating !== null && (
            <ExternalLink className="rating" href={restaurant.links.google} style={{ "--star-fill": `${reviews.rating * 20}%` } as CSSProperties}>
              <span className="rating-platform"><GoogleMark /> Google Maps <Icon name="external" /></span>
              <span className="rating-line flex items-baseline gap-[9px]">
                <strong aria-label={`${rating} ${copy.outOfFive}`}>{rating}</strong>
                <span className="rating-stars" aria-hidden="true">★★★★★<span>★★★★★</span></span>
              </span>
              <span className="rating-count">{`${numbers.format(reviews.count)} ${copy.ratingCount}`}</span>
            </ExternalLink>
          )}
        </div>
      </div>

      <Carousel label={copy.reviewCarousel} copy={copy} speed={15} items={reviews.items.map((review) => ({
        key: review.name,
        content: (
          <article className="review-card flex h-full flex-col">
            <header className="review-author flex items-center">
              <span className="review-avatar" aria-hidden="true">{review.name[0]}</span>
              <div className="grow"><strong>{review.name}</strong><span className="platform">{review.platform}</span></div>
              {review.platform === "Google Maps" && <GoogleMark />}
            </header>
            <div className="stars" role="img" aria-label={`${review.stars} ${copy.outOfFive}`}>
              {"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}
            </div>
            <blockquote lang={review.lang}>{review.quote}</blockquote>
          </article>
        ),
      }))} />
    </section>
  );
}

export function Footer({ copy, language, year, policies, showReviews, inert, menuPage = false }: {
  copy: RestaurantCopy;
  language: Language;
  year: number;
  policies: RestaurantPolicies;
  showReviews: boolean;
  inert: boolean;
  menuPage?: boolean;
}) {
  const { links, contact } = restaurant;
  return (
    <footer className="footer" inert={inert}>
      <div className="shell">
        <div className="footer-grid grid">
          <div>
            <Brand href={menuPage ? "/" : undefined} />
            <p className="tagline">{copy.tagline}</p>
          </div>
          <nav aria-label={copy.footerNav}>
            <h2 className="eyebrow">{copy.explore}</h2>
            <Link href={menuPage ? "/#espaco" : "#espaco"}>{copy.spaceTitle}</Link>
            <Link href={restaurant.links.menu} prefetch={false}>{copy.menuTitle}</Link>
            <Link href={menuPage ? "/#visita" : "#visita"}>{copy.visitTitle}</Link>
            {showReviews && <Link href={menuPage ? "/#avaliacoes" : "#avaliacoes"}>{copy.reviews}</Link>}
          </nav>
          <div className="footer-contact">
            <h2 className="eyebrow">{copy.findUs}</h2>
            <address>{contact.street}<br />{contact.city}</address>
            <a href={links.phone}>{contact.phone}</a>
            <div className="footer-links flex flex-wrap">
              <ExternalLink href={links.directions}><span>{copy.directions}</span><Icon name="external" /></ExternalLink>
              <ExternalLink href={links.instagram}>Instagram<Icon name="external" /></ExternalLink>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} Sea Palace. {copy.rightsReserved} {copy.poweredBy} <ExternalLink href={links.intelis}>Intelis</ExternalLink></p>
          <div className="footer-legal">
            <ExternalLink href={links.complaints}>Livro de Reclamações</ExternalLink>
            {policies.terms && <ExternalLink href={policies.terms}>{copy.terms}</ExternalLink>}
            {policies.privacy && <ExternalLink href={policies.privacy}>{copy.privacy}</ExternalLink>}
            <Link href={`/credits?lang=${language}`}>{copy.credits}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
