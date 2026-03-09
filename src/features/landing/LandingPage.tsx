'use client';

import Link from 'next/link';
import { useAppLocale } from '@/components/I18nClientProvider';
import LocaleSwitcher from '@/shared/components/LocaleSwitcher';
import { useI18n } from '@/locales/client';
import { getLocalizedPath } from '@/locales/config';

export default function LandingPage() {
  const t = useI18n();
  const locale = useAppLocale();
  const libraryPath = getLocalizedPath(locale, '/library');
  const principles = [
    {
      title: t('landing.principles.item1Title'),
      body: t('landing.principles.item1Body'),
    },
    {
      title: t('landing.principles.item2Title'),
      body: t('landing.principles.item2Body'),
    },
    {
      title: t('landing.principles.item3Title'),
      body: t('landing.principles.item3Body'),
    },
    {
      title: t('landing.principles.item4Title'),
      body: t('landing.principles.item4Body'),
    },
  ];
  const steps = [
    t('landing.flow.step1'),
    t('landing.flow.step2'),
    t('landing.flow.step3'),
    t('landing.flow.step4'),
  ];
  const faqs = [
    {
      question: t('landing.faq.item1Question'),
      answer: t('landing.faq.item1Answer'),
    },
    {
      question: t('landing.faq.item2Question'),
      answer: t('landing.faq.item2Answer'),
    },
    {
      question: t('landing.faq.item3Question'),
      answer: t('landing.faq.item3Answer'),
    },
    {
      question: t('landing.faq.item4Question'),
      answer: t('landing.faq.item4Answer'),
    },
    {
      question: t('landing.faq.item5Question'),
      answer: t('landing.faq.item5Answer'),
    },
  ];
  const facts = [
    {
      label: t('landing.facts.principleLabel'),
      value: t('landing.facts.principleValue'),
    },
    {
      label: t('landing.facts.worksLabel'),
      value: t('landing.facts.worksValue'),
    },
    {
      label: t('landing.facts.typoLabel'),
      value: t('landing.facts.typoValue'),
    },
  ];

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
                {t('common.brandName')}
              </span>
              <span className="text-sm text-[color:var(--foreground)]">
                {t('common.brandTagline')}
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
            <Link
              href={libraryPath}
              className="transition hover:text-[color:var(--foreground)]"
            >
              {t('landing.nav.library')}
            </Link>
            <a href="#preview" className="transition hover:text-[color:var(--foreground)]">
              {t('landing.nav.preview')}
            </a>
            <a href="#principles" className="transition hover:text-[color:var(--foreground)]">
              {t('landing.nav.principles')}
            </a>
            <a href="#faq" className="transition hover:text-[color:var(--foreground)]">
              {t('landing.nav.faq')}
            </a>
          </nav>

          <LocaleSwitcher />
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:px-10 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="mb-6 text-xs uppercase tracking-[0.34em] text-[color:var(--accent)]">
              {t('landing.hero.eyebrow')}
            </p>
            <h1 className="max-w-4xl [font-family:var(--font-display)] text-5xl leading-[1.05] tracking-[-0.04em] text-[color:var(--foreground)] sm:text-6xl lg:text-7xl">
              {t('landing.hero.title')}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
              {t('landing.hero.description')}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={libraryPath}
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-[color:var(--accent-strong)]"
              >
                {t('landing.hero.primaryAction')}
              </Link>
              <a
                href="#principles"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.68)] px-6 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              >
                {t('landing.hero.secondaryAction')}
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
                    {t('landing.preview.eyebrow')}
                  </p>
                  <p className="mt-2 text-lg [font-family:var(--font-display)]">
                    {t('landing.preview.title')}
                  </p>
                </div>
                <div className="rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] px-4 py-2 text-xs text-[color:var(--muted)]">
                  {t('landing.preview.chunkBadge')}
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-[color:#181310] px-6 py-7 text-[15px] leading-8 text-[color:#ddd0c3] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <p className="mb-5 text-[11px] uppercase tracking-[0.24em] text-[color:#8f7c6f]">
                  {t('landing.preview.paragraphLabel')}
                </p>
                <p className="text-[color:#9d8f84]">
                  {t('landing.preview.ghostText')}
                </p>
                <p className="-mt-8 text-[color:#f6eee6]">
                  {t('landing.preview.typedPrefix')}
                  <span className="text-[color:#de6e64]">{t('landing.preview.typedError')}</span>
                  {t('landing.preview.typedSuffix')}
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <StatBadge
                    label={t('landing.preview.accuracyLabel')}
                    value={t('landing.preview.accuracyValue')}
                  />
                  <StatBadge
                    label={t('landing.preview.speedLabel')}
                    value={t('landing.preview.speedValue')}
                  />
                  <StatBadge
                    label={t('landing.preview.typoCountLabel')}
                    value={t('landing.preview.typoCountValue')}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <NoteCard
                  label={t('landing.preview.noteRuleLabel')}
                  body={t('landing.preview.noteRuleBody')}
                />
                <NoteCard
                  label={t('landing.preview.noteResumeLabel')}
                  body={t('landing.preview.noteResumeBody')}
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
              eyebrow={t('landing.principles.eyebrow')}
              title={t('landing.principles.title')}
              description={t('landing.principles.description')}
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
            eyebrow={t('landing.flow.eyebrow')}
            title={t('landing.flow.title')}
            description={t('landing.flow.description')}
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
            eyebrow={t('landing.faq.eyebrow')}
            title={t('landing.faq.title')}
            description={t('landing.faq.description')}
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
              {t('landing.footer.eyebrow')}
            </p>
            <p className="mt-4 text-2xl [font-family:var(--font-display)]">
              {t('landing.footer.title')}
            </p>
            <p className="mt-4 text-sm leading-7 text-[color:#bdaea1]">
              {t('landing.footer.description')}
            </p>
          </div>

          <div className="grid gap-2 text-sm text-[color:#cdbfb5]">
            <Link href={libraryPath} className="transition hover:text-white">
              {t('landing.footer.library')}
            </Link>
            <a href="#preview" className="transition hover:text-white">
              {t('landing.footer.preview')}
            </a>
            <a href="#principles" className="transition hover:text-white">
              {t('landing.footer.principles')}
            </a>
            <a href="#faq" className="transition hover:text-white">
              {t('landing.footer.faq')}
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
