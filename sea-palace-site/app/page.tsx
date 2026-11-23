import { RestaurantPage } from "../components/restaurant-page";

export default function Page() {
  return <RestaurantPage year={new Date().getUTCFullYear()} />;
}
