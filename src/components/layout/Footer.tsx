export function Footer() {
  return (
    <footer className="mx-auto mt-auto flex max-w-[1920px] items-center justify-between border-t border-border px-7 py-7">
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="2" width="16" height="16" rx="7" fill="oklch(62% 0.15 290)" />
          <circle cx="19" cy="19" r="7" fill="oklch(68% 0.14 340)" />
        </svg>
        <span className="text-xs font-semibold text-muted">
          © Tc — 커뮤니티가 함께 만들어가요
        </span>
      </div>
      <div className="flex gap-6">
        <a href="#" className="text-[13px] font-semibold text-muted hover:text-ink">
          소개
        </a>
        <a href="#" className="text-[13px] font-semibold text-muted hover:text-ink">
          이용규칙
        </a>
        <a href="#" className="text-[13px] font-semibold text-muted hover:text-ink">
          라이선스 안내
        </a>
        <a href="#" className="text-[13px] font-semibold text-muted hover:text-ink">
          깃허브
        </a>
      </div>
    </footer>
  );
}
