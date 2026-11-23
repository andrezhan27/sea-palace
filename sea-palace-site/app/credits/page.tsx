import type { Metadata } from "next";
import { CreditCopy } from "../../components/credit-copy";
import { restaurant } from "../../lib/restaurant";
import { menuPhotoGallery, menuPhotos } from "../../lib/menu-photos";

export const metadata: Metadata = {
  title: "Créditos de fotografia · Sea Palace",
  robots: { index: false },
};

export default function CreditsPage() {
  return (
    <main className="shell section min-h-svh">
      <div className="max-w-[62ch]">
        <CreditCopy />
        <ul className="list-disc pl-5 text-accent underline underline-offset-2">
          <li><a href={restaurant.links.google}><span lang="ko">소리없이</span> · Google Maps</a></li>
          <li><a href={restaurant.links.google}>Sea Palace · Google Maps</a></li>
          <li><a href={menuPhotoGallery}>{[...new Set(menuPhotos.map(({ credit }) => credit))].join(", ")} · Google Maps</a></li>
          <li><a href="https://lifecooler.com/artigo/comer/restaurante-sea-palace/451632">Lifecooler · Restaurante Sea Palace</a></li>
          <li><a href={restaurant.links.google}>Jorge Silva &amp; Reddy Kallam · Google Maps</a></li>
        </ul>
      </div>
    </main>
  );
}
