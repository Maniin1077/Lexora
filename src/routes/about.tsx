import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Target, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Lexora Community" },
      {
        name: "description",
        content:
          "Learn about Lexora's mission to spread knowledge through collective contribution across law, management and allied domains.",
      },
      { property: "og:title", content: "About Lexora Community" },
      {
        property: "og:description",
        content:
          "A multidisciplinary student community founded to maximise the spread of knowledge.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        contentKey="about"
        eyebrow="About Us"
        title="Knowledge through collective contribution."
        subtitle="Lexora was founded with a singular purpose — to maximise the spread of knowledge with minimal individual burden."
      />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-xl leading-relaxed text-muted-foreground">
          We aim to build a dynamic, multidisciplinary ecosystem where students
          and young professionals from law, management, and allied domains come
          together to learn, grow, and elevate each other. Inspired by{" "}
          <em className="text-primary">Sa Vidyā Ya Vimuktaye</em> — "that
          knowledge which liberates" — Lexora creates meaningful academic and
          cultural engagement across campuses in India.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Our Mission",
              text: "Maximise the spread of knowledge through collective contribution and minimal individual burden.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              text: "A dynamic, multidisciplinary ecosystem uniting law, management and allied domains.",
            },
            {
              icon: Heart,
              title: "Our Culture",
              text: "Collaboration, credibility, and continuous learning — a community that grows because everyone lifts together.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-7"
            >
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Icon className="h-5 w-5 text-navy-deep" />
              </div>
              <h3 className="mt-5 font-display text-2xl text-primary">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-2xl border border-gold/30 bg-secondary/40 p-10">
          <h3 className="font-display text-3xl text-primary">Our Presence</h3>
          <p className="mt-3 text-muted-foreground">
            Lexora's contributions reach students through leading academic and
            legal platforms across India.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {["LinkedIn", "Instagram", "Lawctopus", "Unstop", "LawBhoomi"].map(
              (p) => (
                <span
                  key={p}
                  className="rounded-full border border-gold/40 bg-background px-5 py-2 text-sm font-medium text-primary"
                >
                  {p}
                </span>
              ),
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
