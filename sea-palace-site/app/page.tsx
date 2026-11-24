import { RestaurantPage } from "../components/restaurant-page";
import { getRestaurantPolicies } from "../lib/restaurant-policies";

export const dynamic = "force-static";

export default async function Page() {
  return <RestaurantPage year={new Date().getUTCFullYear()} policies={await getRestaurantPolicies()} />;
}
