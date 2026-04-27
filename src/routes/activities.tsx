import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import {
  MessageSquare,
  PenLine,
  Users,
  Video,
  Briefcase,
  BookOpenCheck,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Activities — Lexora Community" },
      {
        name: "description",
        content:
          "Debates, blog writing, seminars, conferences, webinars, internships and monthly magazines at Lexora.",
      },
      { property: "og:title", content: "Lexora Activities" },
      {
        property: "og:description",
        content:
          "A wide range of academic and professional activities organised year-round.",
      },
    ],
  }),
  component: ActivitiesPage,
});

const items = [
  {
    icon: MessageSquare,
    title: "Debates",
    text: "Structured forums to argue, defend and refine positions on legal and policy questions.",
  },
  {
    icon: PenLine,
    title: "Blog Writing",
    text: "Original, research-driven blogs published on Lexora's official platforms.",
  },
  {
    icon: Users,
    title: "Seminars",
    text: "Interactive sessions led by students, faculty and invited domain experts.",
  },
  {
    icon: Calendar,
    title: "Conferences",
    text: "Multi-disciplinary gatherings featuring academic and practitioner perspectives.",
  },
  {
    icon: Video,
    title: "Webinars",
    text: "Online masterclasses and panels accessible to participants across the country.",
  },
  {
    icon: Briefcase,
    title: "Internship Opportunities",
    text: "Rolling-basis research internships with certificates and letters of recommendation.",
  },
  {
    icon: BookOpenCheck,
    title: "Monthly Magazines",
    text: "A curated monthly publication highlighting the best of community writing.",
  },
];

function ActivitiesPage() {
  return (
    <SiteLayout>
      <PageHero
        contentKey="activities"
        eyebrow="What We Do"
        title="Our Activities"
        subtitle="A wide range of academic and professional activities, designed to build knowledge and community simultaneously."
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-card p-8 transition hover:border-gold hover:-translate-y-1"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-gold transition group-hover:bg-gold group-hover:text-navy-deep">
                <Icon className="h-5 w-5" />
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
      </section>
    </SiteLayout>
  );
}
