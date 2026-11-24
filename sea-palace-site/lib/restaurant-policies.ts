export type RestaurantPolicies = {
  terms?: string;
  privacy?: string;
};

function policyUrl(value: string | null | undefined) {
  if (!value?.trim()) return undefined;

  const url = URL.parse(value.trim());
  if (!url || !["https:", "http:"].includes(url.protocol)) {
    throw new Error("Sea Palace policy URLs must be absolute HTTP or HTTPS URLs.");
  }
  return url.href;
}

export async function getRestaurantPolicies(): Promise<RestaurantPolicies> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url && !key) return {};
  if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY to load Sea Palace policy links.");

  const endpoint = new URL("/rest/v1/restaurants", url);
  endpoint.searchParams.set("id", "eq.seapalace");
  endpoint.searchParams.set("select", "terms_and_conditions_url,privacy_policy_url");
  endpoint.searchParams.set("limit", "1");

  const response = await fetch(endpoint, {
    headers: { apikey: key },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Could not load Sea Palace policy links (HTTP ${response.status}).`);

  const [row] = await response.json() as {
    terms_and_conditions_url: string | null;
    privacy_policy_url: string | null;
  }[];
  if (!row) throw new Error("The Sea Palace row in restaurants is missing or cannot be read.");

  return {
    terms: policyUrl(row.terms_and_conditions_url),
    privacy: policyUrl(row.privacy_policy_url),
  };
}
