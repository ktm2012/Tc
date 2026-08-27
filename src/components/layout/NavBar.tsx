"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/community", label: "커뮤니티" },
  { href: "/assets", label: "에셋" },
  { href: "/projects", label: "프로젝트 참여" },
  { href: "/blog", label: "블로그" },
  { href: "/code", label: "코드 공유" },
];

type NavUser = {
  displayName: string;
  initial: string;
} | null;

export function NavBar({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY.current;
      if (currentY < 80) {
        setHidden(false);
      } else if (delta > 8) {
        setHidden(true);
      } else if (delta < -8) {
        setHidden(false);
      }
      lastY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 mx-auto max-w-[1920px] px-4 pt-5 transition-transform duration-300 ease-out sm:px-7 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <header className="rounded-[20px] border border-border bg-surface shadow-[0_1px_2px_oklch(20%_0_0_/_0.04)]">
        <div className="flex h-[78px] items-center justify-between px-5 sm:px-7">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="16" height="16" rx="7" fill="oklch(62% 0.15 290)" />
                <circle cx="19" cy="19" r="7" fill="oklch(68% 0.14 340)" />
              </svg>
              <span className="text-[19px] font-extrabold text-ink">Tc</span>
            </Link>
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV_ITEMS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? "text-sm font-bold text-ink"
                        : "text-sm font-medium text-muted hover:text-ink"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden items-center gap-2 lg:ml-10 lg:flex">
            {user ? (
              <Link
                href="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[13px] font-bold text-white"
              >
                {user.initial}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-[18px] py-[9px] text-sm font-semibold text-ink hover:bg-surface-2"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-accent px-5 py-[9px] text-sm font-bold text-white"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink lg:hidden"
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {open ? (
          <div className="flex flex-col gap-1 border-t border-border px-5 py-4 lg:hidden">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={
                    active
                      ? "rounded-xl px-3 py-2.5 text-sm font-bold text-ink"
                      : "rounded-xl px-3 py-2.5 text-sm font-medium text-muted"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-ink"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-white">
                    {user.initial}
                  </span>
                  내 프로필
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-ink"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-bold text-white"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </header>
    </div>
  );
}
