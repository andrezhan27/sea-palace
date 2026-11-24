import type { Metadata } from "next";
import { MenuPage } from "../../components/menu-page";
import { restaurant } from "../../lib/restaurant";
import { getRestaurantPolicies } from "../../lib/restaurant-policies";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `${restaurant.copy.pt.menuTitle} · Sea Palace`,
  description: restaurant.copy.pt.menuCopy,
};

export default async function Page() {
  return <MenuPage year={new Date().getUTCFullYear()} policies={await getRestaurantPolicies()} />;
}
