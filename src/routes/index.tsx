import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  ArrowRight,
  BookOpen,
  Users,
  Mic,
  FileText,
  Globe,
  Award,
} from "lucide-react";
import logo from "@/assets/lexora-logo.jpg";
import { useEffect, useState } from "react";
import {
  getHomeHeroContent,
  HOME_HERO_DEFAULTS,
  SITE_CONTENT_CHANGED_EVENT,
  SITE_CONTENT_KEY,
} from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lexora Community — Knowledge that Liberates" },
      {
        name: "description",
        content:
          "Lexora is a multidisciplinary student community for law, management, and allied domains. Sa Vidyā Ya Vimuktaye.",
      },
      { property: "og:title", content: "Lexora Community" },
      {
        property: "og:description",
        content:
          "Knowledge that liberates. Join a multidisciplinary ecosystem of debates, blogs, conferences and internships.",
      },
    ],
  }),
  component: HomePage,
});

const highlights = [
  {
    icon: Mic,
    title: "Debates & Seminars",
    text: "Sharpen reasoning through structured academic discourse.",
  },
  {
    icon: FileText,
    title: "Blogs & Magazines",
    text: "Publish research-driven writing on law and policy.",
  },
  {
    icon: Globe,
    title: "Conferences & Webinars",
    text: "Engage with practitioners and scholars across India.",
  },
  {
    icon: Award,
    title: "Internships",
    text: "Earn certificates, LoRs and real publication credits.",
  },
];

function HomePage() {
  const [hero, setHero] = useState(() =>
    getHomeHeroContent({ ...HOME_HERO_DEFAULTS, image: logo }),
  );

  useEffect(() => {
    const load = () => {
      setHero(getHomeHeroContent({ ...HOME_HERO_DEFAULTS, image: logo }));
    };

    load();

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === SITE_CONTENT_KEY) {
        load();
      }
    };

    window.addEventListener(SITE_CONTENT_CHANGED_EVENT, load);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(SITE_CONTENT_CHANGED_EVENT, load);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 25%, oklch(0.72 0.13 75 / 0.45), transparent 45%), radial-gradient(circle at 85% 75%, oklch(0.72 0.13 75 / 0.3), transparent 50%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
          <div className="text-primary-foreground">
            <p className="text-xs uppercase tracking-[0.4em] text-gold">
              {hero.motto}
            </p>
            <h1 className="mt-5 font-display text-5xl font-medium leading-tight md:text-7xl">
              {hero.titleLineOne}
              <br />
              that <span className="italic text-gold">{hero.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/80">
              {hero.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/internships"
                className="group inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-medium text-navy-deep shadow-gold transition hover:translate-y-[-2px]"
                style={{ background: "var(--gradient-gold)" }}
              >
                {hero.primaryCtaText}{" "}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-md border border-gold/40 px-6 py-3.5 text-sm font-medium text-primary-foreground hover:bg-gold/10"
              >
                {hero.secondaryCtaText}
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-3xl"
                style={{ background: "var(--gradient-gold)", opacity: 0.4 }}
              />
              <div className="relative h-72 w-72 overflow-hidden rounded-full ring-4 ring-gold/30 md:h-96 md:w-96">
                <img
                  src={hero.image}
                  alt="Lexora Community emblem"
                  className="h-full w-full scale-[1.08] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            What we do
          </p>
          <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
            A learning ecosystem, by students for students.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-card p-7 transition hover:border-gold hover:shadow-elegant"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Icon className="h-5 w-5 text-navy-deep" />
              </div>
              <h3 className="mt-5 font-display text-xl text-primary">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Join */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Why Lexora
            </p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
              Grow collectively as influence widens.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Lexora is more than a group — it is an ecosystem of collaboration,
              credibility, and continuous learning. Your participation shapes
              the culture.
            </p>
            <Link
              to="/members"
              className="mt-8 inline-flex items-center gap-2 font-medium text-primary hover:text-accent"
            >
              Meet the team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="space-y-4">
            {[
              "Enhance your LinkedIn presence with verifiable contributions",
              "Strengthen your CV through meaningful research initiatives",
              "Expand a multidisciplinary network across India",
              "Earn certificates, letters of recommendation and publications",
            ].map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm text-gold">
                  {i + 1}
                </span>
                <span className="text-foreground/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div
          className="overflow-hidden rounded-2xl px-10 py-16 text-center text-primary-foreground md:px-16"
          style={{ background: "var(--gradient-hero)" }}
        >
          <BookOpen className="mx-auto h-10 w-10 text-gold" />
          <h2 className="mt-5 font-display text-4xl md:text-5xl">
            Ready to contribute & grow?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">
            Applications for the Research Internship are open on a rolling
            basis.
          </p>
          <Link
            to="/internships"
            className="mt-8 inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-sm font-medium text-navy-deep"
            style={{ background: "var(--gradient-gold)" }}
          >
            View Internship Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
