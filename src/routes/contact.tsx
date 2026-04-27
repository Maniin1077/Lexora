import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Mail, Phone, Linkedin, Instagram } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  CONTACT_DETAILS_DEFAULTS,
  SITE_CONTENT_CHANGED_EVENT,
  SITE_CONTENT_KEY,
  getContactDetails,
} from "@/lib/site-content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Lexora Community" },
      {
        name: "description",
        content:
          "Get in touch with Lexora Community via email, phone, LinkedIn or Instagram.",
      },
      { property: "og:title", content: "Contact Lexora Community" },
      {
        property: "og:description",
        content: "Reach the Lexora team — we'd love to hear from you.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { user } = useAuth();
  const [contact, setContact] = useState(() =>
    getContactDetails({ ...CONTACT_DETAILS_DEFAULTS }),
  );

  useEffect(() => {
    const load = () => setContact(getContactDetails({ ...CONTACT_DETAILS_DEFAULTS }));

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

  const requireLoginForExternal = (
    e: MouseEvent<HTMLAnchorElement>,
    label: string,
  ) => {
    if (user) return;

    e.preventDefault();
    toast.error("Please sign in first", {
      description: `You must be logged in to open ${label}.`,
      action: {
        label: "Sign in",
        onClick: () => (window.location.href = "/login"),
      },
    });
  };

  return (
    <SiteLayout>
      <PageHero
        contentKey="contact"
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Questions, collaborations, or want to join the community? Reach out — we read every message."
      />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <a
            href={`mailto:${contact.email}`}
            onClick={(e) => requireLoginForExternal(e, "email link")}
            className="group rounded-xl border border-border bg-card p-8 transition hover:border-gold"
          >
            <Mail className="h-7 w-7 text-accent" />
            <h3 className="mt-4 font-display text-2xl text-primary">Email</h3>
            <p className="mt-2 text-foreground/85 group-hover:text-accent">
              {contact.email}
            </p>
          </a>
          <div className="rounded-xl border border-border bg-card p-8">
            <Phone className="h-7 w-7 text-accent" />
            <h3 className="mt-4 font-display text-2xl text-primary">Phone</h3>
            <p className="mt-2 text-foreground/85">
              {contact.phonePrimaryLabel} — {contact.phonePrimaryNumber}
            </p>
            <p className="text-foreground/85">
              {contact.phoneSecondaryLabel} — {contact.phoneSecondaryNumber}
            </p>
          </div>
          <a
            href={contact.linkedInUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => requireLoginForExternal(e, "LinkedIn")}
            className="group rounded-xl border border-border bg-card p-8 transition hover:border-gold"
          >
            <Linkedin className="h-7 w-7 text-accent" />
            <h3 className="mt-4 font-display text-2xl text-primary">
              LinkedIn
            </h3>
            <p className="mt-2 text-foreground/85 group-hover:text-accent">
              {contact.linkedInLabel}
            </p>
          </a>
          <a
            href={contact.instagramUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => requireLoginForExternal(e, "Instagram")}
            className="group rounded-xl border border-border bg-card p-8 transition hover:border-gold"
          >
            <Instagram className="h-7 w-7 text-accent" />
            <h3 className="mt-4 font-display text-2xl text-primary">
              Instagram
            </h3>
            <p className="mt-2 text-foreground/85 group-hover:text-accent">
              {contact.instagramLabel}
            </p>
          </a>
        </div>

        <div
          className="mt-14 rounded-2xl p-10 text-center text-primary-foreground"
          style={{ background: "var(--gradient-hero)" }}
        >
          <h3 className="font-display text-3xl">
            Join an ecosystem that lifts together.
          </h3>
          <p className="mt-3 text-primary-foreground/75">
            Explore active opportunities and become part of Lexora.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
