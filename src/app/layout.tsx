import type { Metadata } from "next";
import { Noto_Sans_KR, JetBrains_Mono } from "next/font/google";
import { auth } from "@/auth";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Tc — 유니티 & 블렌더 개발자 커뮤니티",
    template: "%s",
  },
  description:
    "질문하고, 에셋을 나누고, 같이 프로젝트를 만들어가는 게임 개발자 커뮤니티예요.",
  openGraph: {
    title: "Tc — 유니티 & 블렌더 개발자 커뮤니티",
    description:
      "질문하고, 에셋을 나누고, 같이 프로젝트를 만들어가는 게임 개발자 커뮤니티예요.",
    siteName: "Tc",
    locale: "ko_KR",
    type: "website",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  let navUser = null;
  try {
    const session = await auth();
    if (session?.user) {
      const name = session.user.name ?? session.user.username ?? "user";
      navUser = { displayName: name, initial: name.slice(0, 1) };
    }
  } catch {
    // DB not reachable yet (placeholder DATABASE_URL) — render as guest.
    navUser = null;
  }

  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-ink">
        <NavBar user={navUser} />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
