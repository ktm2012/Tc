import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_KR, JetBrains_Mono } from "next/font/google";
import { auth } from "@/auth";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { ChatProvider } from "@/components/chat/ChatContext";
import { ChatWidget, type ChatCurrentUser } from "@/components/chat/ChatWidget";
import { ADSENSE_CLIENT_ID } from "@/lib/adsense";
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
  let chatUser: ChatCurrentUser = null;
  try {
    const session = await auth();
    if (session?.user) {
      const name = session.user.name ?? session.user.username ?? "user";
      navUser = { displayName: name, initial: name.slice(0, 1) };
      if (session.user.id && session.user.username) {
        chatUser = {
          id: session.user.id,
          username: session.user.username,
          displayName: name,
          initial: name.slice(0, 1),
        };
      }
    }
  } catch {
    // DB not reachable yet (placeholder DATABASE_URL) — render as guest.
    navUser = null;
  }

  const adsenseClientId = ADSENSE_CLIENT_ID;

  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-ink">
        {adsenseClientId ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <ChatProvider>
          <NavBar user={navUser} />
          <main className="flex flex-1 flex-col pt-[100px]">{children}</main>
          <Footer />
          <ChatWidget currentUser={chatUser} />
        </ChatProvider>
      </body>
    </html>
  );
}
