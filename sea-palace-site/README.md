# Sea Palace

Bilingual restaurant website built with Next.js 16, the App Router, TypeScript, and Tailwind CSS 4. Use Node.js 22 and npm.

```sh
cd sea-palace-site
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run build` to type-check and generate the static site in `out/`. The existing private Sites project also serves that directory.

## GitHub and Vercel

Commit and push from the repository root, one level above `sea-palace-site`. Import the GitHub repository in Vercel, set Root Directory to `sea-palace-site`, and use `main` as the production branch. The app's `vercel.json` runs `npm ci` and `npm run build`, serves `out/`, and enables extensionless URLs such as `/credits`. The site requires no environment variables. GitHub Actions verifies the production build on pushes and pull requests.

## Editing

- `lib/restaurant.ts` contains Portuguese and English copy, contact details, destinations, dishes, prices, and reviews. Set `reviews.enabled` to `false` to remove the reviews and their navigation links.
- `app/page.tsx` and `app/credits/page.tsx` are the App Router routes. The landing page sections and carousel live in `components/`.
- The palette, typography, and spacing are defined in `app/globals.css`. Photography and fonts live in `public/assets/`. The provisional seal uses 海上天, the name displayed by the restaurant’s Google Maps owner profile.
- Menu carousel photos live in `public/assets/menu/`. Each dish has 480 px and 800 px WebP variants. Order, captions, alt text and credits are in `lib/menu-photos.ts`.

## Content sources

- [Google Maps](https://maps.app.goo.gl/sjRDuvkhqEgZgHh59) — verified 17 November 2026. Address, phone, hours, menu categories and listed prices, aggregate rating and attributed guest excerpts. The booking action opens the listed restaurant number to request a table by phone.
- [Sea Palace’s Uber Eats listing](https://www.ubereats.com/pt/store/sea-palace/WicGYMAHTTmkjIjcdPoc2g) — full online menu for the Passeio das Tágides location. Listed prices can differ from dine-in prices.
- [TheFork](https://www.thefork.pt/restaurante/sea-palace-r842658) — guest excerpt. The profile showed no online booking availability.
- The credits page lists the photo sources. Venue and food images come from public listings for this restaurant. Confirm usage rights and brand assets before a wider release.
