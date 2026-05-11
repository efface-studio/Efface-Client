import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export default async function DemoPage({ params }: Props) {
  const { slug } = await params;

  let job:
    | { status: string; html_path: string | null; error: string | null; created_at: string }
    | null = null;
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("demo_jobs")
      .select("status, html_path, error, created_at")
      .eq("slug", slug)
      .single();
    job = data;
  } catch {
    job = null;
  }

  if (!job) notFound();

  if (job.status === "ready" && job.html_path) {
    const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/demos/${job.html_path}`;
    return (
      <div className="fixed inset-0 bg-[var(--color-paper)]">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title="Generated demo"
          sandbox="allow-scripts allow-forms allow-popups"
        />
      </div>
    );
  }

  if (job.status === "failed") {
    return (
      <Centered title="데모 생성에 실패했습니다.">
        <p>잠시 후 새 신청으로 다시 요청해 주세요. 문제는 자동으로 기록되었어요.</p>
      </Centered>
    );
  }

  return (
    <Centered title="데모 시안 생성 중…">
      <p>보내주신 정보를 바탕으로 시안을 만들고 있어요. 보통 1~2분이면 완료됩니다.</p>
      <p className="mt-2 text-xs text-[var(--color-muted)]">
        준비가 끝나면 메일로 링크를 보내드립니다. 이 페이지는 자동으로 새로고침됩니다.
      </p>
      <meta httpEquiv="refresh" content="10" />
    </Centered>
  );
}

function Centered({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--color-paper)]">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center gap-2 mb-5 text-xs font-mono text-[var(--color-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          efface / demo
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">{title}</h1>
        <div className="text-[var(--color-muted)] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
