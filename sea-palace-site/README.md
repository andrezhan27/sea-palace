# Sea Palace

Bilingual restaurant website built with Next.js 16, the App Router, TypeScript, and Tailwind CSS 4. Use Node.js 22 and npm.

```sh
cd sea-palace-site
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run build` to type-check and generate the static site in `out/`. The existing private Sites project also serves that directory.

## GitHub and Vercel

Import the GitHub repository in Vercel and set Root Directory to `sea-palace-site`. Use `main` as the production branch and Node.js 22.x. The app's `vercel.json` uses the Other framework preset, runs `npm ci` and `npm run build`, serves `out/`, and enables extensionless URLs such as `/menu` and `/credits`. GitHub Actions verifies the production build on pushes and pull requests.

To include Terms and Conditions and Privacy Policy in the footer, add both variables from [`.env.example`](.env.example) in Vercel under **Settings → Environment Variables**. Select Production and any Preview environments that should show the links. For a local build, copy the example to `.env.local` and fill in the values.

Use the Supabase project URL and its publishable key. The Supabase `anon` role needs read access to the `terms_and_conditions_url` and `privacy_policy_url` fields on the `restaurants` row with `id = seapalace`. Store absolute HTTPS URLs for the documents. The build adds each available link to the home and menu footers. Redeploy after updating either the environment variables or the URLs in Supabase. Builds with both variables unset omit the policy links.

## Editing

- `lib/restaurant.ts` contains Portuguese and English copy, contact details, destinations, dishes, prices, and reviews. Set `reviews.enabled` to `false` to remove the reviews and their navigation links.
- The home, menu and credits routes live in `app/`. The landing page sections and carousel live in `components/`.
- The palette, typography, and spacing are defined in `app/globals.css`. Photography and fonts live in `public/assets/`. The provisional seal uses 海上天, the name displayed by the restaurant’s Google Maps owner profile.
- Menu categories, dish names and image IDs are in `lib/menu-categories.ts`. Dish thumbnails and the downloadable menu PDF live in `public/assets/menu/`.
- The space gallery uses the 480 px and 960 px WebP variants in `public/assets/space/`. Gallery order and bilingual alt text are in `lib/space-photos.ts`.

## Content sources

- [Google Maps](https://maps.app.goo.gl/sjRDuvkhqEgZgHh59) — verified 17 November 2026. Address, phone, hours, menu categories and listed prices, aggregate rating and attributed guest excerpts. The booking action opens the listed restaurant number to request a table by phone.
- [Sea Palace’s Uber Eats listing](https://www.ubereats.com/pt/store/sea-palace/WicGYMAHTTmkjIjcdPoc2g) — full online menu for the Passeio das Tágides location. Listed prices can differ from dine-in prices.
- [TheFork](https://www.thefork.pt/restaurante/sea-palace-r842658) — guest excerpt. The profile showed no online booking availability.
- The credits page lists the photo sources. Venue and food images come from public listings for this restaurant. Confirm usage rights and brand assets before a wider release.
