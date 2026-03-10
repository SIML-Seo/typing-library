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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        id="top"
        className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[color:rgba(250,249,247,0.92)] backdrop-blur-xl"
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="text-base font-semibold tracking-tight text-[color:var(--foreground)]">
            {t('common.brandName')}
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href={libraryPath}
              className="rounded-lg px-3 py-1.5 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
            >
              {t('landing.nav.library')}
            </Link>
            <a href="#preview" className="rounded-lg px-3 py-1.5 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]">
              {t('landing.nav.preview')}
            </a>
            <a href="#principles" className="rounded-lg px-3 py-1.5 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]">
              {t('landing.nav.principles')}
            </a>
            <a href="#faq" className="rounded-lg px-3 py-1.5 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]">
              {t('landing.nav.faq')}
            </a>
          </nav>

          <LocaleSwitcher />
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="animate-fade-up mx-auto max-w-6xl px-5 pb-20 pt-20 lg:pt-28">
          <p className="text-sm tracking-wide text-[color:var(--muted)]">
            {t('landing.hero.eyebrow')}
          </p>
          <h1 className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] tracking-tight [font-family:var(--font-display)] text-[color:var(--foreground)]">
            {t('landing.hero.title')}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--muted)]">
            {t('landing.hero.description')}
          </p>

          <div className="mt-10 flex items-center gap-4">
            <Link
              href={libraryPath}
              className="inline-flex items-center rounded-lg bg-[color:var(--foreground)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              {t('landing.hero.primaryAction')}
            </Link>
            <a
              href="#principles"
              className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
            >
              {t('landing.hero.secondaryAction')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>
        </section>

        {/* Preview */}
        <section id="preview" className="animate-fade-up-delay-1 mx-auto max-w-6xl px-5 pb-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Typing demo card */}
            <div className="overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)]">
              <div className="flex items-center justify-between border-b border-[color:var(--line)] px-6 py-4">
                <div>
                  <p className="text-sm text-[color:var(--muted)]">{t('landing.preview.eyebrow')}</p>
                  <p className="mt-1 text-lg [font-family:var(--font-display)]">
                    {t('landing.preview.title')}
                  </p>
                </div>
                <span className="rounded-md bg-[color:var(--surface-sunken)] px-2.5 py-1 text-xs text-[color:var(--muted)]">
                  {t('landing.preview.chunkBadge')}
                </span>
              </div>

              <div className="bg-[#1c1917] px-6 py-8 font-mono text-[15px] leading-8">
                <p className="mb-4 text-xs tracking-wider text-[#78716c]">
                  {t('landing.preview.paragraphLabel')}
                </p>
                <div className="relative">
                  <p className="text-[#57534e]">
                    {t('landing.preview.ghostText')}
                  </p>
                  <p className="absolute inset-0 text-[#fafaf9]">
                    {t('landing.preview.typedPrefix')}
                    <span className="text-red-400">{t('landing.preview.typedError')}</span>
                    {t('landing.preview.typedSuffix')}
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3">
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

              <div className="grid gap-px border-t border-[color:var(--line)] bg-[color:var(--line)] sm:grid-cols-2">
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

            {/* Facts sidebar */}
            <div className="flex flex-col gap-4">
              <FactCard
                label={t('landing.facts.principleLabel')}
                value={t('landing.facts.principleValue')}
              />
              <FactCard
                label={t('landing.facts.worksLabel')}
                value={t('landing.facts.worksValue')}
              />
              <FactCard
                label={t('landing.facts.typoLabel')}
                value={t('landing.facts.typoValue')}
              />
            </div>
          </div>
        </section>

        {/* Principles */}
        <section
          id="principles"
          className="border-y border-[color:var(--line)] bg-[color:var(--surface)]"
        >
          <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
            <SectionHeader
              eyebrow={t('landing.principles.eyebrow')}
              title={t('landing.principles.title')}
              description={t('landing.principles.description')}
            />

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--line)] md:grid-cols-2 xl:grid-cols-4">
              {principles.map((item, index) => (
                <article
                  key={item.title}
                  className="bg-[color:var(--background)] p-6"
                >
                  <span className="text-sm tabular-nums text-[color:var(--accent)]">
                    0{index + 1}
                  </span>
                  <h2 className="mt-4 text-lg font-medium text-[color:var(--foreground)]">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Flow */}
        <section className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
          <SectionHeader
            eyebrow={t('landing.flow.eyebrow')}
            title={t('landing.flow.title')}
            description={t('landing.flow.description')}
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="group relative rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 transition hover:border-[color:var(--accent)] hover:shadow-sm"
              >
                <span className="text-4xl font-light tabular-nums text-[color:var(--line)] transition group-hover:text-[color:var(--accent-soft)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-4 text-base leading-relaxed text-[color:var(--foreground)]">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="mx-auto max-w-3xl px-5 pb-24"
        >
          <SectionHeader
            eyebrow={t('landing.faq.eyebrow')}
            title={t('landing.faq.title')}
            description={t('landing.faq.description')}
          />

          <div className="mt-10 divide-y divide-[color:var(--line)]">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-medium text-[color:var(--foreground)] marker:hidden">
                  {item.question}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="shrink-0 text-[color:var(--muted)] transition-transform duration-200 group-open:rotate-45"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </summary>
                <p className="pb-5 pr-8 text-sm leading-relaxed text-[color:var(--muted)]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[color:var(--line)] bg-[color:var(--foreground)] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-lg">
            <p className="text-sm text-white/50">
              {t('landing.footer.eyebrow')}
            </p>
            <p className="mt-4 text-xl [font-family:var(--font-display)]">
              {t('landing.footer.title')}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {t('landing.footer.description')}
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm text-white/50">
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
          </nav>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium text-[color:var(--accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl leading-snug [font-family:var(--font-display)] text-[color:var(--foreground)] sm:text-3xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-[color:var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2.5">
      <p className="text-xs text-[#a8a29e]">{label}</p>
      <p className="mt-1 text-sm text-[#fafaf9]">{value}</p>
    </div>
  );
}

function NoteCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="bg-[color:var(--background)] px-6 py-5">
      <p className="text-xs font-medium text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--foreground)]">
        {body}
      </p>
    </div>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
      <p className="text-xs text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}
