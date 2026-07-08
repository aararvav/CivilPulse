"use client";

import Link from "next/link";
import { ChakraMotif } from "@/components/ui/Chakra";
import { CountUp } from "@/components/motion/CountUp";
import { FadeIn, ScrollReveal } from "@/components/motion/Motion";
import {
  AiSummaryPreview,
  ComparePreview,
  MapPreview,
  SubmitPreview,
  ThemesPreview,
} from "@/components/landing/FeaturePreviews";

interface LandingStats {
  totalSubmissions: number;
  wardCount: number;
  themeCount: number;
  analysisTime: string;
}

const FEATURES = [
  {
    title: "Multi-channel citizen submissions",
    description:
      "Residents submit development needs via text and photo, in Hindi or English. Location and ward are captured automatically.",
    bullets: ["Text + photo upload", "Hindi & English input", "Ward & geolocation"],
    preview: <SubmitPreview />,
    accent: "saffron",
  },
  {
    title: "AI-powered request analysis",
    description:
      "Every submission is translated, categorized, and scored for urgency — giving staff an analytical insight, not just raw text.",
    bullets: ["Auto-translation", "Category tagging", "Priority scoring"],
    preview: <AiSummaryPreview />,
    accent: "green",
    reverse: true,
  },
  {
    title: "Demand hotspot mapping",
    description:
      "See where requests cluster geographically, colored by category, so field teams know where to focus first.",
    bullets: ["Category-colored pins", "Click for detail", "Ward-level view"],
    preview: <MapPreview />,
    accent: "saffron",
  },
  {
    title: "Theme clustering & ranking",
    description:
      "Recurring issues are grouped into themes and ranked by volume and priority — surfacing what citizens keep asking for.",
    bullets: ["Auto theme matching", "Rank by demand", "Expandable detail"],
    preview: <ThemesPreview />,
    accent: "green",
    reverse: true,
  },
  {
    title: "Data-backed prioritization",
    description:
      "Compare citizen education demand side-by-side with official enrollment and travel-distance data — the core pitch for evidence-based planning.",
    bullets: ["Citizen demand vs. public data", "Ward-level comparison", "Auto recommendation"],
    preview: <ComparePreview />,
    accent: "saffron",
    highlight: true,
  },
];

const STEPS = [
  { step: "01", title: "Citizen submits", body: "Text, photo, and location via the public portal." },
  { step: "02", title: "AI analyzes", body: "Translation, categorization, and priority scoring in seconds." },
  { step: "03", title: "Staff reviews", body: "Dashboard, map, and themes show ranked demand." },
  { step: "04", title: "Data informs action", body: "Compare requests against official ward datasets." },
];

export function LandingPage({ stats }: { stats: LandingStats }) {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="chakra-glow pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-32 top-1/4 opacity-[0.07] text-ink">
          <ChakraMotif size={520} stroke="var(--color-ink)" animate />
        </div>

        <div className="relative mx-auto max-w-content px-4 pb-16 pt-20 sm:px-6 lg:pt-28">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-civic">
              MP Constituency Development Intelligence
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl lg:text-[3.5rem]">
              Turn scattered citizen requests into a ranked action plan
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-civic">
              CivicPulse consolidates voice, text, and photo submissions from residents — runs AI
              analysis on each one — and gives MPs a ranked, map-based view of what their
              constituency actually needs.
            </p>
          </FadeIn>
          <FadeIn delay={0.35} className="mt-10 flex flex-wrap gap-4">
            <Link href="/signup" className="btn-primary">
              Submit a Request
            </Link>
            <Link href="/admin/dashboard" className="btn-secondary">
              View Admin Demo
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-line bg-canvas-raised">
        <div className="mx-auto grid max-w-content grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {[
            { label: "Submissions processed", value: stats.totalSubmissions },
            { label: "Wards covered", value: stats.wardCount },
            { label: "Themes identified", value: stats.themeCount },
            { label: "AI analysis time", value: stats.analysisTime, isText: true },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.05}>
              <div className="text-center sm:text-left">
                <p className="font-mono text-3xl font-semibold text-ink sm:text-4xl">
                  {stat.isText ? (
                    stat.value
                  ) : (
                    <CountUp end={stat.value as number} />
                  )}
                </p>
                <p className="mt-1 text-sm text-slate-civic">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-content px-4 py-20 sm:px-6">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-semibold text-ink">Platform capabilities</h2>
          <p className="mt-3 max-w-2xl text-slate-civic">
            Built for MP offices — every feature below is live in this demo, not a mockup.
          </p>
        </ScrollReveal>

        <div className="mt-14 space-y-10">
          {FEATURES.map((feature) => (
            <ScrollReveal key={feature.title} delay={0.05}>
              <article
                className={`card group grid gap-8 p-6 transition-all duration-200 hover:-translate-y-1 lg:grid-cols-2 lg:p-8 ${
                  feature.highlight ? "border-ink/20 ring-1 ring-ink/5" : ""
                } ${
                  feature.accent === "saffron"
                    ? "hover:border-saffron/40"
                    : "hover:border-civic-green/40"
                }`}
              >
                <div className={`${feature.reverse ? "lg:order-2" : ""}`}>
                  {feature.preview}
                </div>
                <div className={`flex flex-col justify-center ${feature.reverse ? "lg:order-1" : ""}`}>
                  {feature.highlight && (
                    <span className="mb-3 inline-flex w-fit rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-ink">
                      Signature capability
                    </span>
                  )}
                  <h3 className="font-display text-2xl font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-civic">{feature.description}</p>
                  <ul className="mt-4 space-y-2">
                    {feature.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-ink">
                        <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-line bg-canvas-raised">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-semibold text-ink">How it works</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 0.06}>
                <div className="card-static p-5">
                  <p className="font-mono text-2xl font-semibold text-saffron">{step.step}</p>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-civic">{step.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-content px-4 py-20 text-center sm:px-6">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-semibold text-ink">
            Ready to see your constituency&apos;s priorities?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-civic">
            Submit a development request or explore the admin dashboard with live seeded data.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="btn-primary">
              Submit a Request
            </Link>
            <Link href="/admin/dashboard" className="btn-secondary">
              View Admin Demo
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-canvas-raised">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div>
            <p className="font-display text-lg font-semibold text-ink">CivicPulse</p>
            <p className="mt-1 text-xs text-slate-civic">
              Civic tool for constituency development intelligence.
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/signup" className="text-slate-civic hover:text-ink transition-colors">
              Submit
            </Link>
            <Link href="/admin/dashboard" className="text-slate-civic hover:text-ink transition-colors">
              Admin
            </Link>
            <Link href="/login" className="text-slate-civic hover:text-ink transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
