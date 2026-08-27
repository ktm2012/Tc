// Google AdSense publisher ID for this site. Hardcoded so the loader script
// and /ads.txt work with no env configuration; NEXT_PUBLIC_ADSENSE_CLIENT_ID
// still overrides it if the site is ever pointed at a different account.
export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6697242877126530";
