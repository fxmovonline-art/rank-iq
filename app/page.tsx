"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CircleCheck,
  Cpu,
  Linkedin,
  Instagram,
  Github,
  Search,
  Sparkles,
  Globe,
  Mail,
} from "lucide-react";

const testimonialCards = [
  {
    quote: "RankIQ helped us uncover content gaps we were blind to. Organic leads doubled in 8 weeks.",
    name: "Ayesha Khan",
    role: "Growth Lead, Nova Clinics",
  },
  {
    quote: "The strategy output is clean, practical, and actually executable by our content team.",
    name: "Hassan Ali",
    role: "Head of Marketing, SwiftCart",
  },
  {
    quote: "From scrape to roadmap, everything feels premium and fast. Exactly what we needed.",
    name: "Mariam Saeed",
    role: "Founder, Urban Niche",
  },
  {
    quote: "The dashboard made competitor positioning very clear. We now ship SEO work with confidence.",
    name: "Bilal Raza",
    role: "SEO Manager, PixelHouse",
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
];

const entry: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <span className="text-base font-bold">R</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">RankIQ</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#reviews" className="hover:text-slate-900 transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="px-6 py-14 lg:px-10 lg:py-20">
          <motion.div
            initial="hidden"
            animate="show"
            variants={entry}
            className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered SEO Operations
            </div>
            <h1 className="mt-8 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              The Intelligence Layer for Modern SEO.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              RankIQ transforms scattered SEO data into clear decisions. Audit competitors, spot high-impact gaps, and generate execution-ready strategy in minutes.
            </p>

            <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Start for Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-7 py-3 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50"
              >
                View Demo
              </Link>
            </div>
          </motion.div>
        </section>

        <section id="how-it-works" className="px-6 py-10 lg:px-10 lg:py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={entry}
            className="mx-auto w-full max-w-7xl"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">How it works</h2>
            <p className="mt-3 max-w-2xl text-slate-600">A streamlined workflow from URL input to strategy delivery.</p>

            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                  <Globe className="h-5 w-5 text-slate-700" />
                </div>
                <p className="text-sm font-semibold text-indigo-600">Step 1</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">Input URL</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Add your website and competitors. RankIQ structures your market context instantly.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 pulse-ring">
                  <Cpu className="h-5 w-5 text-indigo-700" />
                </div>
                <p className="text-sm font-semibold text-indigo-600">Step 2</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">AI Analysis</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Signal extraction, competitor gap detection, and local ranking interpretation happen in one flow.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100">
                  <CircleCheck className="h-5 w-5 text-emerald-700" />
                </div>
                <p className="text-sm font-semibold text-indigo-600">Step 3</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">Strategy Ready</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Receive practical, actionable recommendations and a roadmap your team can execute immediately.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section id="reviews" className="overflow-hidden px-6 py-10 lg:px-10 lg:py-20">
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

          <div className="relative mt-8">
            <div className="marquee-track flex w-max gap-4">
              {[...testimonialCards, ...testimonialCards].map((item, index) => (
                <article
                  key={`${item.name}-${index}`}
                  className="w-[320px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm leading-relaxed text-slate-700">"{item.quote}"</p>
                  <p className="mt-5 text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-6 py-10 lg:px-10 lg:py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={entry}
            className="mx-auto w-full max-w-7xl"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Simple, transparent pricing</h2>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
                <h3 className="text-xl font-semibold tracking-tight">Free Plan</h3>
                <p className="mt-2 text-sm text-slate-600">Perfect for getting started.</p>
                <p className="mt-6 text-4xl font-bold tracking-tight">$0</p>
                <p className="mt-2 text-sm text-slate-500">1 Project</p>
                <ul className="mt-8 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Basic audit</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Strategy preview</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Email support</li>
                </ul>
              </article>

              <article className="relative rounded-2xl border border-indigo-200 bg-white p-10 shadow-sm">
                <span className="absolute right-5 top-5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  Most Popular
                </span>
                <h3 className="text-xl font-semibold tracking-tight">Pro Plan</h3>
                <p className="mt-2 text-sm text-slate-600">For teams scaling SEO execution.</p>
                <p className="mt-6 text-4xl font-bold tracking-tight">$49</p>
                <p className="mt-2 text-sm text-slate-500">Unlimited Projects</p>
                <ul className="mt-8 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Full competitive analysis</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> AI strategy generation</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Priority support</li>
                </ul>
              </article>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-6 py-10 lg:px-10 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <span className="text-base font-bold">R</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">RankIQ</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              SEO intelligence platform for modern teams building predictable growth.
            </p>
            <div className="mt-5 flex items-center gap-3 text-slate-500">
              <a href="#" className="rounded-md p-2 hover:bg-slate-100 hover:text-slate-800"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="rounded-md p-2 hover:bg-slate-100 hover:text-slate-800"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="rounded-md p-2 hover:bg-slate-100 hover:text-slate-800"><Github className="h-4 w-4" /></a>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">{column.title}</h4>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Newsletter</h4>
            <p className="mt-4 text-sm text-slate-600">Weekly growth insights, product updates, and SEO playbooks.</p>
            <form className="mt-4 space-y-3">
              <label className="sr-only" htmlFor="newsletter-email">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <button
                type="button"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Subscribe
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .marquee-track {
          animation: rankiq-marquee 34s linear infinite;
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
      `}</style>
    </div>
  );
}
