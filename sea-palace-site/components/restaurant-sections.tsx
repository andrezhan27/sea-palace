import Link from "next/link";
import type { CSSProperties } from "react";
import { menuPhotos } from "../lib/menu-photos";
import { restaurant, type Language, type RestaurantCopy } from "../lib/restaurant";
import { Carousel } from "./carousel";
import { BookLink, Brand, ExternalLink, Icon, Photo, Seal, SectionTitle } from "./site-ui";

const gallery = [
  { name: "booths", widths: [640, 960], alt: "boothsAlt", wide: true },
  { name: "detail", widths: [480, 960], alt: "detailAlt", wide: false },
  { name: "table", widths: [480, 960], alt: "tableAlt", wide: false },
  { name: "terrace", widths: [640, 960], alt: "terraceAlt", wide: true },
] as const;

export function Hero({ copy }: { copy: RestaurantCopy }) {
  return (
    <section className="hero relative isolate grid place-items-center text-center" id="inicio" aria-labelledby="hero-title">
      <picture className="hero-photo">
        <source media="(max-width: 600px)" srcSet="/assets/storefront-corrected-mobile-640.webp 640w, /assets/storefront-corrected-mobile-780.webp 780w" sizes="100vw" />
        <img
          src="/assets/storefront-corrected-1440.webp"
          srcSet="/assets/storefront-corrected-960.webp 960w, /assets/storefront-corrected-1440.webp 1440w, /assets/storefront-corrected-1774.webp 1774w"
          sizes="100vw"
          width={1774}
          height={887}
          alt={copy.heroAlt}
          fetchPriority="high"
        />
      </picture>
      <div className="hero-content">
        <p className="eyebrow">{copy.heroKicker}</p>
        <h1 id="hero-title" tabIndex={-1}>Sea Palace</h1>
        <div className="hero-actions flex flex-wrap justify-center">
          <BookLink>{copy.book}</BookLink>
          <a className="button button-outline" href="#carta">{copy.viewMenu}</a>
        </div>
      </div>
      <a className="hero-scroll flex flex-col items-center" href="#espaco">
        <span>{copy.scroll}</span>
        <Icon name="down" />
      </a>
    </section>
  );
}

export function SpaceSection({ copy }: { copy: RestaurantCopy }) {
  return (
    <section className="section shell" id="espaco" aria-labelledby="space-title">
      <div className="section-head grid" data-reveal>
        <SectionTitle id="space-title" number="01">{copy.spaceTitle}</SectionTitle>
        <p>{copy.spaceCopy}</p>
      </div>
      <div className="space-grid grid grid-cols-2">
        {gallery.map(({ name, widths, alt, wide }, index) => (
          <figure className="photo" data-reveal style={{ "--reveal-delay": `${60 * index}ms` } as CSSProperties} key={name}>
            <Photo
              name={name}
              widths={widths}
              sizes={wide ? "(max-width: 600px) calc(100vw - 40px), 47vw" : "(max-width: 600px) 45vw, 47vw"}
              width={960}
              height={650}
              alt={copy[alt]}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

export function MenuSection({ copy, language }: { copy: RestaurantCopy; language: Language }) {
  return (
    <section className="section bg-band" id="carta" aria-labelledby="menu-title">
      <div className="shell section-head grid" data-reveal>
        <SectionTitle id="menu-title" number="02">{copy.menuTitle}</SectionTitle>
        <div>
          <p>{copy.menuCopy}</p>
          <div className="text-links flex flex-wrap">
            <ExternalLink className="text-link" href={restaurant.links.menu}>
              <span>{copy.fullMenu}</span><Icon name="external" />
            </ExternalLink>
          </div>
        </div>
      </div>

      <Carousel name="food" label={copy.foodCarousel} copy={copy} speed={21} items={menuPhotos.map(({ name, alt, caption }) => ({
        key: name,
        content: (
          <figure className="food-card photo relative isolate">
            <Photo
              name={`menu/${name}`}
              widths={[480, 800]}
              sizes="(max-width: 600px) 80vw, (max-width: 900px) 49vw, 34vw"
              width={800}
              height={600}
              alt={alt[language]}
              draggable={false}
            />
            <figcaption>{caption[language]}</figcaption>
          </figure>
        ),
      }))} />
      <SpecialtiesCard copy={copy} language={language} />
    </section>
  );
}

function SpecialtiesCard({ copy, language }: { copy: RestaurantCopy; language: Language }) {
  const price = new Intl.NumberFormat(copy.locale, { style: "currency", currency: "EUR" });

  return (
    <div className="signature shell" id="especialidades" data-reveal>
      <div className="signature-brand grid justify-items-center gap-2.5">
        <Seal />
        <h3 className="text-center">{copy.specialties}</h3>
      </div>
      <div className="signature-grid grid">
        {Object.entries(restaurant.dishes).map(([group, dishes]) => (
          <div key={group}>
            <h4 className="eyebrow">{group === "dimSum" ? "Dim sum" : copy.duck}</h4>
            <dl>
              {dishes.map((dish) => (
                <div className="flex items-baseline justify-between gap-3.5" key={dish.pt}>
                  <dt>{dish[language]}</dt>
                  <dd>{price.format(dish.price)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <p className="signature-note text-center">{copy.priceNote}</p>
    </div>
  );
}

export function VisitSection({ copy }: { copy: RestaurantCopy }) {
  const { links, contact } = restaurant;

  return (
    <section className="section visit shell" id="visita" aria-labelledby="visit-title">
      <SectionTitle id="visit-title" number="03" reveal>{copy.visitTitle}</SectionTitle>
      <div className="visit-grid grid items-center">
        <figure className="photo visit-photo" data-reveal>
          <Photo
            name="venue"
            widths={[640, 1100]}
            sizes="(max-width: 760px) calc(100vw - 40px), 48vw"
            width={1100}
            height={1150}
            alt={copy.venueAlt}
          />
        </figure>
        <div className="visit-info" data-reveal>
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
      <div className="map relative overflow-hidden">
        <iframe
          className="size-full border-0"
          title={copy.mapTitle}
          width={1320}
          height={345}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          src={restaurant.links.map}
        />
        <ExternalLink className="button button-map" href={links.directions}>
          <span>{copy.directions}</span><Icon name="external" />
        </ExternalLink>
      </div>
    </section>
  );
}

export function ReviewsSection({ copy }: { copy: RestaurantCopy }) {
  const { reviews } = restaurant;
  const numbers = new Intl.NumberFormat(copy.locale);
  const rating = reviews.rating == null ? null : numbers.format(reviews.rating);

  return (
    <section className="section bg-band reviews" id="avaliacoes" aria-labelledby="reviews-title">
      <div className="shell">
        <SectionTitle id="reviews-title" number="04" reveal>{copy.reviewsTitle}</SectionTitle>
        <div className="review-feature relative">
          <figure className="photo review-photo">
            <Photo
              name="reviews"
              widths={[800, 1440]}
              sizes="(max-width: 600px) calc(100vw - 40px), 92vw"
              width={1440}
              height={580}
              alt={copy.reviewsAlt}
            />
          </figure>
          {rating !== null && (
            <ExternalLink className="rating" href={restaurant.links.google} style={{ "--star-fill": `${reviews.rating * 20}%` } as CSSProperties}>
              <span className="eyebrow">Google Maps <Icon name="external" /></span>
              <span className="rating-line flex items-baseline gap-[9px]">
                <strong aria-label={`${rating} ${copy.outOfFive}`}>{rating}</strong>
                <span className="rating-stars" aria-hidden="true">★★★★★<span>★★★★★</span></span>
              </span>
              <span className="rating-count">{`${numbers.format(reviews.count)} ${copy.ratingCount}`}</span>
            </ExternalLink>
          )}
        </div>
      </div>

      <Carousel name="review" label={copy.reviewCarousel} copy={copy} speed={15} items={reviews.items.map((review) => ({
        key: review.name,
        content: (
          <article className="review-card flex h-full flex-col gap-2.5">
            <div className="stars" aria-label={`${review.stars} ${copy.outOfFive}`}>
              {"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}
            </div>
            <blockquote className="grow" lang={review.lang}>{`“${review.quote}”`}</blockquote>
            <div className="review-author flex items-center gap-2">
              <span className="review-avatar" aria-hidden="true">{review.name[0]}</span>
              <div><strong>{review.name}</strong><span className="platform">{review.platform}</span></div>
            </div>
          </article>
        ),
      }))} />
    </section>
  );
}

export function Footer({ copy, language, year, showReviews, inert }: {
  copy: RestaurantCopy;
  language: Language;
  year: number;
  showReviews: boolean;
  inert: boolean;
}) {
  const { links, contact } = restaurant;
  return (
    <footer className="footer" inert={inert}>
      <div className="shell">
        <div className="footer-grid grid">
          <div>
            <Brand />
            <p className="tagline">{copy.tagline}</p>
          </div>
          <nav aria-label={copy.footerNav}>
            <h2 className="eyebrow">{copy.explore}</h2>
            <a href="#espaco">{copy.spaceTitle}</a>
            <a href="#carta">{copy.menuTitle}</a>
            <a href="#visita">{copy.visitTitle}</a>
            {showReviews && <a href="#avaliacoes">{copy.reviews}</a>}
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
        <div className="footer-bottom flex justify-between gap-3">
          <span>© {year} Sea Palace</span>
          <Link href={`/credits?lang=${language}`}>{copy.credits}</Link>
        </div>
      </div>
    </footer>
  );
}
