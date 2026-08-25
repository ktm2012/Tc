// AdSense checks /ads.txt to confirm this site is authorized to show ads
// for the given publisher — see .env.example for how NEXT_PUBLIC_ADSENSE_CLIENT_ID
// gets set. Returns 404 (rather than an empty/fake file) until it is.
export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) {
    return new Response(null, { status: 404 });
  }

  const pubId = clientId.replace(/^ca-/, "");
  return new Response(`google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain" },
  });
}
