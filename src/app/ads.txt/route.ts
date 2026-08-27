import { ADSENSE_CLIENT_ID } from "@/lib/adsense";

// AdSense checks /ads.txt to confirm this site is authorized to show ads
// for the given publisher.
export async function GET() {
  const pubId = ADSENSE_CLIENT_ID.replace(/^ca-/, "");
  return new Response(`google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain" },
  });
}
