const principles = [
  {
    title: "원문 그대로 판정",
    body: "공백, 줄바꿈, 구두점까지 원문 기준으로 비교하고, 오타는 즉시 빨간색으로만 보여줍니다.",
  },
  {
    title: "진행은 멈추지 않음",
    body: "오타가 나도 계속 입력할 수 있고, 문단이 끝났을 때 해당 문단의 오타를 다시 확인합니다.",
  },
  {
    title: "비로그인 · 로컬 저장",
    body: "결과, 내 작품, 이어하기 드래프트는 모두 이 기기 안에 저장합니다. 서버 쓰기를 만들지 않습니다.",
  },
  {
    title: "공개 작품 + 내 작품",
    body: "저작권이 만료된 공개 작품을 읽고, 직접 붙여 넣거나 `.txt`로 추가한 내 작품도 같은 방식으로 필사합니다.",
  },
];

const steps = [
  "작품을 고른다",
  "회색 원문 위에 그대로 타이핑한다",
  "문단마다 오타를 확인하고 이어 쓴다",
  "완료 후 정확도·WPM·시간을 로컬에 남긴다",
];

const faqs = [
  {
    question: "왜 로그인 없이 시작하나요?",
    answer:
      "MVP 목표가 무료 운영과 빠른 진입이기 때문입니다. 기록과 내 작품은 우선 로컬에만 저장해 서버 비용을 만들지 않습니다.",
  },
  {
    question: "오타가 나면 입력이 멈추나요?",
    answer:
      "멈추지 않습니다. 오타 글자만 빨간색으로 표시하고 계속 입력할 수 있게 둡니다. 문단이 끝나면 이번 문단의 오타를 다시 보여줍니다.",
  },
  {
    question: "공백이나 줄바꿈도 맞아야 하나요?",
    answer:
      "맞습니다. 이 서비스는 문장을 그대로 옮기는 필사 경험이 핵심이라 공백, 줄바꿈, 구두점도 원문과 같아야 합니다.",
  },
  {
    question: "공개 작품은 어디서 오나요?",
    answer:
      "앱과 분리된 works origin에서 정적 파일로 읽습니다. 앱 배포 없이 작품만 갱신할 수 있도록 설계합니다.",
  },
  {
    question: "운영 비용은 어떻게 막나요?",
    answer:
      "정적 호스팅, 로컬 저장, works 분리 배포, 캐시 정책, 서버 쓰기 금지라는 네 가지 원칙으로 0원 운영을 유지합니다.",
  },
];

const facts = [
  { label: "MVP 원칙", value: "비로그인 · 로컬 저장" },
  { label: "공개 작품", value: "works origin 분리" },
  { label: "오타 피드백", value: "즉시 표시 · 진행 허용" },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top,_rgba(187,88,58,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute left-1/2 top-56 h-80 w-80 -translate-x-1/2 rounded-full bg-[rgba(110,40,30,0.08)] blur-3xl" />

      <header
        id="top"
        className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[color:rgba(244,239,230,0.82)] backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#top" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.7)] text-sm font-semibold tracking-[0.2em] text-[color:var(--accent)]">
              TL
            </span>
            <span className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
                Typing Library
              </span>
              <span className="text-sm text-[color:var(--foreground)]">
                문장을 그대로 옮기는 필사 타이핑
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
            <a href="#preview" className="transition hover:text-[color:var(--foreground)]">
              필사 방식
            </a>
            <a href="#principles" className="transition hover:text-[color:var(--foreground)]">
              운영 원칙
            </a>
            <a href="#faq" className="transition hover:text-[color:var(--foreground)]">
              FAQ
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:px-10 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="mb-6 text-xs uppercase tracking-[0.34em] text-[color:var(--accent)]">
              Public-domain literature · typing as transcription
            </p>
            <h1 className="max-w-4xl [font-family:var(--font-display)] text-5xl leading-[1.05] tracking-[-0.04em] text-[color:var(--foreground)] sm:text-6xl lg:text-7xl">
              저작권이 만료된 문학을, 눈으로 읽고 손으로 그대로 옮긴다.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
              Typing Library는 작품을 읽는 속도와 입력의 리듬을 한 화면에
              겹쳐 두는 필사형 타이핑 앱이다. 회색 원문 위에 입력이 덮여
              올라가고, 오타는 멈추지 않은 채 바로 드러난다.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#preview"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-[color:var(--accent-strong)]"
              >
                필사 화면 구조 보기
              </a>
              <a
                href="#principles"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.68)] px-6 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              >
                무료 운영 원칙 확인
              </a>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.68)] px-5 py-4 shadow-[0_20px_60px_rgba(47,28,19,0.06)]"
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
                    {fact.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div id="preview" className="relative">
            <div className="absolute -left-4 top-10 hidden h-28 w-28 rounded-full border border-[color:rgba(163,59,43,0.18)] lg:block" />
            <div className="rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,243,236,0.92))] p-6 shadow-[0_30px_120px_rgba(60,34,24,0.16)]">
              <div className="flex items-center justify-between border-b border-[color:var(--line)] pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                    Typing Preview
                  </p>
                  <p className="mt-2 text-lg [font-family:var(--font-display)]">
                    작품 위에 입력이 덮여 올라가는 방식
                  </p>
                </div>
                <div className="rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] px-4 py-2 text-xs text-[color:var(--muted)]">
                  문단 기준
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-[color:#181310] px-6 py-7 text-[15px] leading-8 text-[color:#ddd0c3] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <p className="mb-5 text-[11px] uppercase tracking-[0.24em] text-[color:#8f7c6f]">
                  paragraph 03
                </p>
                <p className="text-[color:#9d8f84]">
                  시간이 지나면 슬픔은 무뎌지기 마련이에요. 그래서 아저씨도
                  언젠가 슬픔이 지나가면 나를 알게 된 것이 기쁨이 되겠지요.
                </p>
                <p className="-mt-8 text-[color:#f6eee6]">
                  시간이 지나면 슬픔은
                  <span className="text-[color:#de6e64]"> 무</span>
                  뎌지기 마련이에요. 그래서 아저씨도 언젠가 슬픔이 지나가면
                  나를 알게 된 것이 기쁨이 되겠지요.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <StatBadge label="정확도" value="97.4%" />
                  <StatBadge label="속도" value="312 CPM" />
                  <StatBadge label="오타" value="문단 1건" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <NoteCard
                  label="입력 규칙"
                  body="공백, 줄바꿈, 구두점, 대문자까지 원문 기준으로 판정"
                />
                <NoteCard
                  label="세션 복원"
                  body="새로고침 후 같은 작품의 진행 지점과 입력값을 이어서 복원"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="principles"
          className="border-y border-[color:var(--line)] bg-[color:rgba(255,255,255,0.42)]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <SectionIntro
              eyebrow="MVP principles"
              title="필사 경험과 운영 원칙을 동시에 고정한다"
              description="이 프로젝트는 타이핑 UX를 만드는 일과 0원 운영을 지키는 일을 같은 우선순위로 둔다."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {principles.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:rgba(250,247,241,0.88)] p-6 shadow-[0_18px_50px_rgba(53,31,22,0.06)]"
                >
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[color:var(--accent)]">
                    principle
                  </p>
                  <h2 className="mt-4 text-xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <SectionIntro
            eyebrow="Flow"
            title="사용자는 짧고 분명한 흐름만 밟는다"
            description="작품 선택에서 결과 저장까지, 중간에 로그인이나 서버 저장을 끼워 넣지 않는다."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="relative overflow-hidden rounded-[1.75rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.68)] p-6"
              >
                <div className="absolute right-5 top-4 text-5xl [font-family:var(--font-display)] text-[color:rgba(163,59,43,0.12)]">
                  0{index + 1}
                </div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  step {index + 1}
                </p>
                <p className="relative mt-8 text-lg leading-8 text-[color:var(--foreground)]">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="faq"
          className="mx-auto max-w-5xl px-6 pb-20 lg:px-10 lg:pb-28"
        >
          <SectionIntro
            eyebrow="FAQ"
            title="문서 단계에서 이미 고정된 기준들"
            description="구현 전에 흔들리지 않도록, 주요 질문의 답을 먼저 확정해 둔다."
          />

          <div className="mt-8 space-y-4">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-[1.5rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] px-6 py-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg [font-family:var(--font-display)] text-[color:var(--foreground)] marker:hidden">
                  {item.question}
                  <span className="text-sm text-[color:var(--accent)] transition group-open:rotate-45">
                    ＋
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[color:var(--line)] bg-[color:#181310] text-[color:#e7dbcf]">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[color:#b79d8e]">
              Typing Library
            </p>
            <p className="mt-4 text-2xl [font-family:var(--font-display)]">
              읽는 것과 입력하는 것을 분리하지 않는 필사 도구
            </p>
            <p className="mt-4 text-sm leading-7 text-[color:#bdaea1]">
              공개 작품은 저작권이 만료된 텍스트만 제공하고, 사용자 데이터는
              로컬에만 저장한다. 문의 채널과 정책 페이지는 실제 배포 시점에
              연결한다.
            </p>
          </div>

          <div className="grid gap-2 text-sm text-[color:#cdbfb5]">
            <a href="#preview" className="transition hover:text-white">
              필사 화면 구조
            </a>
            <a href="#principles" className="transition hover:text-white">
              운영 원칙
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl leading-tight [font-family:var(--font-display)] text-[color:var(--foreground)] sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-[color:var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:rgba(255,255,255,0.08)] bg-[color:rgba(255,255,255,0.03)] px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[color:#8f7c6f]">
        {label}
      </p>
      <p className="mt-2 text-sm text-[color:#f6eee6]">{value}</p>
    </div>
  );
}

function NoteCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-[1.35rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.58)] px-5 py-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-[color:var(--foreground)]">
        {body}
      </p>
    </div>
  );
}
