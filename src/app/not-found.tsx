import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center px-7 py-16">
      <div className="rounded-3xl border border-border bg-surface p-10 text-center">
        <div className="mx-auto mb-4 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-surface-2 text-[26px] font-extrabold text-muted">
          ?
        </div>
        <h1 className="mb-2 text-xl font-extrabold">페이지를 찾을 수 없어요</h1>
        <p className="mb-7 text-sm text-muted">
          주소가 잘못됐거나, 삭제됐거나, 아직 존재하지 않는 페이지예요.
        </p>
        <Link
          href="/"
          className="inline-block rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-white"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  );
}
