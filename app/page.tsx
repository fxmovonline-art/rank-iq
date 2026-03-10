"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowRight,
  LoaderCircle,
  CheckCircle2,
  CircleCheck,
  Cpu,
  Linkedin,
  Instagram,
  Github,
  Search,
  Sparkles,
  Star,
  Globe,
  Mail,
  Menu,
  X,
} from "lucide-react";

const EASE_SMOOTH = [0.16, 1, 0.3, 1] as const;
const EASE_STANDARD = [0.25, 0.1, 0.25, 1] as const;
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const testimonialCards = [
  {
    quote: "RankIQ helped us uncover content gaps we were blind to. Organic leads doubled in 8 weeks.",
    name: "Ayesha Khan",
    role: "Growth Lead, Nova Clinics",
    initials: "AK",
  },
  {
    quote: "The strategy output is clean, practical, and actually executable by our content team.",
    name: "Hassan Ali",
    role: "Head of Marketing, SwiftCart",
    initials: "HA",
  },
  {
    quote: "From scrape to roadmap, everything feels premium and fast. Exactly what we needed.",
    name: "Mariam Saeed",
    role: "Founder, Urban Niche",
    initials: "MS",
  },
  {
    quote: "The dashboard made competitor positioning very clear. We now ship SEO work with confidence.",
    name: "Bilal Raza",
    role: "SEO Manager, PixelHouse",
    initials: "BR",
  },
];

const footerColumns = [
  {
    title: "Product",
    links: ["Features", "How It Works", "Integrations", "Pricing"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Case Studies", "SEO Guides", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Security", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookie Policy", "Data Processing"],
  },
];

const entry: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_SMOOTH } },
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`${plusJakarta.className} min-h-screen bg-[#F4F7FA] text-slate-900`}>
      <header className="sticky top-0 z-50 rounded-b-[2rem] border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-3" aria-label="Go to homepage">
            <div className="flex h-9 w-9 items-center justify-center rounded-[2rem] bg-[#3e64ff] text-white">
              <span className="text-base font-bold">R</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">RankIQ</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#reviews" className="hover:text-slate-900 transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-[2rem] border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="rounded-[2rem] bg-[#3e64ff] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3558e6]"
            >
              Dashboard
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[2rem] border border-slate-200 bg-white text-slate-700 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE_STANDARD }}
              className="fixed inset-0 z-[60] bg-slate-900/45 backdrop-blur-sm md:hidden"
            >
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: EASE_SMOOTH }}
                className="ml-auto flex h-full w-[88%] max-w-sm flex-col rounded-l-[2rem] bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    aria-label="Go to homepage"
                    className="flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-[2rem] bg-[#3e64ff] text-white">
                      <span className="text-sm font-bold">R</span>
                    </div>
                    <span className="font-semibold tracking-tight">RankIQ</span>
                  </Link>
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-[2rem] border border-slate-200 text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-8 flex flex-col gap-2 text-base font-medium text-slate-700">
                  <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="rounded-[2rem] px-4 py-3 hover:bg-slate-50">How It Works</a>
                  <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="rounded-[2rem] px-4 py-3 hover:bg-slate-50">Reviews</a>
                  <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="rounded-[2rem] px-4 py-3 hover:bg-slate-50">Pricing</a>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex min-h-12 items-center justify-center rounded-[2rem] border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex min-h-12 items-center justify-center rounded-[2rem] bg-[#3e64ff] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Dashboard
                  </Link>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 py-12 lg:px-10 lg:py-24">
          <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 -translate-x-1/3 -translate-y-1/3 rounded-full bg-sky-200/45 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-[#ff6b6b]/20 blur-3xl" />

          <motion.div
            initial="hidden"
            animate="show"
            variants={entry}
            className="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-[2rem] border border-[#ff6b6b]/20 bg-[#ff6b6b]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#ff6b6b]">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered SEO Operations
            </div>
            <h1 className="mt-8 max-w-5xl text-balance text-4xl font-extrabold leading-[0.95] tracking-tight text-slate-900 sm:text-5xl lg:text-[5.75rem]">
              The Intelligence Layer for Modern SEO.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              RankIQ transforms scattered SEO data into clear decisions. Audit competitors, spot high-impact gaps, and generate execution-ready strategy in minutes.
            </p>

            <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[2rem] bg-[#3e64ff] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#3558e6]"
              >
                Start for Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex min-h-12 items-center justify-center rounded-[2rem] border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50"
              >
                View Demo
              </Link>
            </div>

            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, ease: EASE_STANDARD, repeat: Infinity }}
              className="mt-12 w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 text-left shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] sm:rounded-[3rem] sm:p-7"
            >
              <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50 p-3 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">RankIQ Mini-Dashboard</h3>
                  <div className="inline-flex items-center gap-2 rounded-[2rem] bg-[#ff6b6b]/10 px-3 py-1 text-xs font-semibold text-[#ff6b6b]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff6b6b]" />
                    Analyzing...
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Search className="h-4 w-4" />
                    <span className="truncate text-sm">Search project or domain: rankiq.com</span>
                  </div>
                </div>

                <div className="mt-5 rounded-[2rem] border border-[#ff6b6b]/25 bg-[#ff6b6b]/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#ff6b6b]">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Analyzing ranking signals and competitor gaps...</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-[2rem] bg-[#ffd6d6]">
                    <motion.div
                      className="h-2 rounded-[2rem] bg-[#3e64ff]"
                      animate={{ width: ["22%", "67%", "94%", "62%", "88%"] }}
                      transition={{ duration: 4.8, ease: EASE_STANDARD, repeat: Infinity }}
                    />
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto rounded-[2rem] border border-slate-200 bg-white">
                  <table className="w-full min-w-[520px] border-collapse text-xs sm:text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Keyword Cluster</th>
                        <th className="px-4 py-3 text-left font-semibold">Opportunity</th>
                        <th className="px-4 py-3 text-left font-semibold">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-800">Local SEO Pages</td>
                        <td className="px-4 py-3 text-emerald-600">+31% traffic gap</td>
                        <td className="px-4 py-3"><span className="rounded-[2rem] bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">High</span></td>
                      </tr>
                      <tr className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-800">Comparison Content</td>
                        <td className="px-4 py-3 text-amber-600">+18% CTR potential</td>
                        <td className="px-4 py-3"><span className="rounded-[2rem] bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Medium</span></td>
                      </tr>
                      <tr className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-800">Schema Enhancements</td>
                        <td className="px-4 py-3 text-sky-600">Featured snippet lift</td>
                        <td className="px-4 py-3"><span className="rounded-[2rem] bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Quick Win</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section id="how-it-works" className="px-6 py-12 lg:px-10 lg:py-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={entry}
            className="mx-auto w-full max-w-7xl"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Features Bento Grid</h2>
            <p className="mt-3 max-w-2xl text-slate-600">Purpose-built modules arranged in a flexible layout for speed, clarity, and scale.</p>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:auto-rows-[minmax(210px,auto)] xl:grid-cols-4">
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: EASE_STANDARD }}
                whileHover={{ y: -10 }}
                className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-[0_20px_40px_-18px_rgba(62,100,255,0.18)] transition-shadow hover:shadow-[0_30px_60px_-18px_rgba(62,100,255,0.3)] md:col-span-2 xl:col-span-2"
              >
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[2rem] bg-sky-100">
                  <Globe className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Market Discovery Engine</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
                  Scan SERP layers, map regional competition, and identify ranking pressure across your primary keyword clusters.
                </p>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05, ease: EASE_STANDARD }}
                whileHover={{ y: -10 }}
                className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-[0_20px_40px_-18px_rgba(62,100,255,0.18)] transition-shadow hover:shadow-[0_30px_60px_-18px_rgba(62,100,255,0.3)] xl:row-span-2"
              >
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[2rem] bg-violet-100">
                  <Cpu className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">AI Signal Processing</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Module A and Module B coordinate to score intent, relevance, and opportunity so teams can prioritize confidently.
                </p>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1, ease: EASE_STANDARD }}
                whileHover={{ y: -10 }}
                className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-[0_20px_40px_-18px_rgba(62,100,255,0.18)] transition-shadow hover:shadow-[0_30px_60px_-18px_rgba(62,100,255,0.3)]"
              >
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[2rem] bg-emerald-100">
                  <CircleCheck className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900">Execution-Ready Output</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">Ship strategy documents your SEO and content teams can execute immediately.</p>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.15, ease: EASE_STANDARD }}
                whileHover={{ y: -10 }}
                className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-[0_20px_40px_-18px_rgba(62,100,255,0.18)] transition-shadow hover:shadow-[0_30px_60px_-18px_rgba(62,100,255,0.3)] xl:col-span-2"
              >
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[2rem] bg-rose-100">
                  <Sparkles className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Priority Scoreboard</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
                  See quick wins, high-impact clusters, and projected gain bands in one decisive dashboard surface.
                </p>
              </motion.article>
            </div>
          </motion.div>
        </section>

        <section id="reviews" className="overflow-hidden px-6 py-12 lg:px-10 lg:py-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={entry}
            className="mx-auto w-full max-w-7xl"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Loved by performance teams</h2>
            <p className="mt-3 text-slate-600">Real outcomes from teams using RankIQ for strategic SEO execution.</p>
          </motion.div>

          <div className="marquee-fade relative mt-8 overflow-hidden rounded-[2rem]">
            <div className="marquee-track flex w-max gap-6">
              {[0, 1].map((groupIndex) => (
                <div key={`review-group-${groupIndex}`} className="flex gap-4">
                  {testimonialCards.map((item) => (
                    <article
                      key={`${item.name}-${groupIndex}`}
                      className="w-[260px] rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-3 flex items-center gap-2 text-amber-400">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={`${item.name}-star-${index}`} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">"{item.quote}"</p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3e64ff]/10 text-xs font-semibold text-[#3e64ff]">
                          {item.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.role}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-6 py-12 lg:px-10 lg:py-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={entry}
            className="mx-auto w-full max-w-7xl"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Simple, transparent pricing</h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <article className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
                <h3 className="text-xl font-semibold tracking-tight">Free Plan</h3>
                <p className="mt-2 text-sm text-slate-600">Perfect for getting started.</p>
                <p className="mt-6 text-4xl font-bold tracking-tight">$0</p>
                <p className="mt-2 text-sm text-slate-500">1 Project</p>
                <ul className="mt-8 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> 1 Project</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Basic Insights</li>
                </ul>
              </article>

              <article className="relative rounded-[2rem] border-4 border-indigo-500/20 bg-white p-10 shadow-lg shadow-[#3e64ff]/20">
                <span className="absolute right-3 top-3 z-10 rotate-[-6deg] rounded-[2rem] bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-700 sm:right-5 sm:top-5">
                  Best Choice
                </span>
                <h3 className="text-xl font-semibold tracking-tight">Pro Plan</h3>
                <p className="mt-2 text-sm text-slate-600">For teams scaling SEO execution.</p>
                <p className="mt-6 text-4xl font-bold tracking-tight">$49</p>
                <p className="mt-2 text-sm text-slate-500">Unlimited Projects</p>
                <ul className="mt-8 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Unlimited Projects</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> AI Strategies</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Priority Export</li>
                </ul>
              </article>
            </div>
          </motion.div>
        </section>

        <section id="stay-updated" className="px-6 py-12 lg:px-10 lg:py-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={entry}
            className="mx-auto w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-lg shadow-[#3e64ff]/8"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Stay Updated</h2>
            <p className="mt-3 text-slate-600">Get monthly product notes and SEO playbooks. Contact: hello@rankiq.app</p>
            <form className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="stay-updated-email">Email</label>
              <div className="relative w-full">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="stay-updated-email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-[2rem] border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#3e64ff] focus:outline-none focus:ring-2 focus:ring-[#3e64ff]/20"
                />
              </div>
              <button
                type="button"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[2rem] bg-[#3e64ff] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3558e6] sm:w-auto"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </section>
      </main>

      <footer className="rounded-t-[2rem] bg-[#0a192f] px-6 py-16 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[2rem] bg-[#3e64ff] text-white">
              <span className="text-base font-bold">R</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">RankIQ</span>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="text-sm font-semibold uppercase tracking-tight text-slate-100">{column.title}</h4>
                <ul className="mt-4 space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-300 transition-colors hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-slate-700 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300">© 2026 RankIQ. All rights reserved.</p>
            <div className="flex items-center gap-3 text-slate-300">
              <a aria-label="LinkedIn" href="#" className="rounded-[2rem] p-2 transition-colors hover:bg-slate-800 hover:text-white"><Linkedin className="h-4 w-4" /></a>
              <a aria-label="Instagram" href="#" className="rounded-[2rem] p-2 transition-colors hover:bg-slate-800 hover:text-white"><Instagram className="h-4 w-4" /></a>
              <a aria-label="GitHub" href="#" className="rounded-[2rem] p-2 transition-colors hover:bg-slate-800 hover:text-white"><Github className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .marquee-track {
          will-change: transform;
          animation: rankiq-marquee 68s linear infinite;
        }
        .marquee-fade {
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        .pulse-ring {
          animation: rankiq-pulse 1.8s ease-in-out infinite;
        }
        @keyframes rankiq-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes rankiq-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.15);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
          }
        }

        @media (max-width: 767px) {
          .marquee-track {
            animation-duration: 88s;
          }
        }
      `}</style>
    </div>
  );
}
