import { Link } from "@tanstack/react-router";
import { Mail, Phone, Linkedin, Instagram } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import logo from "@/assets/lexora-logo.jpg";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  CONTACT_DETAILS_DEFAULTS,
  NAV_LABEL_DEFAULTS,
  SITE_CONTENT_CHANGED_EVENT,
  SITE_CONTENT_KEY,
  getContactDetails,
  getNavigationLabels,
} from "@/lib/site-content";

export function SiteFooter() {
  const { user } = useAuth();
  const [navLabels, setNavLabels] = useState(() =>
    getNavigationLabels({ ...NAV_LABEL_DEFAULTS }),
  );
  const [contact, setContact] = useState(() =>
    getContactDetails({ ...CONTACT_DETAILS_DEFAULTS }),
  );

  useEffect(() => {
    const load = () => {
      setNavLabels(getNavigationLabels({ ...NAV_LABEL_DEFAULTS }));
      setContact(getContactDetails({ ...CONTACT_DETAILS_DEFAULTS }));
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
    <footer className="mt-24 bg-navy-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Lexora"
              className="h-12 w-12 rounded-full ring-1 ring-gold/50"
            />
            <div>
              <p className="font-display text-2xl">Lexora Community</p>
              <p className="text-xs uppercase tracking-[0.25em] text-gold">
                Sa Vidyā Ya Vimuktaye
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/70">
            A multidisciplinary ecosystem where students and young professionals
            from law, management, and allied domains come together to learn,
            grow, and elevate each other.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg text-gold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
            <li>
              <Link to="/about" className="hover:text-gold">
                {navLabels.about}
              </Link>
            </li>
            <li>
              <Link to="/activities" className="hover:text-gold">
                {navLabels.activities}
              </Link>
            </li>
            <li>
              <Link to="/members" className="hover:text-gold">
                {navLabels.members}
              </Link>
            </li>
            <li>
              <Link to="/internships" className="hover:text-gold">
                {navLabels.internships}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold">
                {navLabels.contact}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg text-gold">Connect</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" />
              <span>{contact.email}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              <span>
                {contact.phonePrimaryLabel} - {contact.phonePrimaryNumber}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              <span>
                {contact.phoneSecondaryLabel} - {contact.phoneSecondaryNumber}
              </span>
            </li>
            <li className="flex gap-3 pt-2">
              <a
                href={contact.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => requireLoginForExternal(e, "LinkedIn")}
                className="rounded-full border border-gold/40 p-2 transition hover:bg-gold hover:text-navy-deep"
                aria-label={contact.linkedInLabel}
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => requireLoginForExternal(e, "Instagram")}
                className="rounded-full border border-gold/40 p-2 transition hover:bg-gold hover:text-navy-deep"
                aria-label={contact.instagramLabel}
              >
                <Instagram className="h-4 w-4" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-primary-foreground/60 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Lexora Community. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-2">
            <span className="text-gold/80">
              Website designed & developed by
            </span>
            <span className="font-medium text-primary-foreground">
              Baratam Sri Manikanta
            </span>
            <span className="text-primary-foreground/40">·</span>
            <a
              href="mailto:bsmanikanta2004@gmail.com"
              onClick={(e) => requireLoginForExternal(e, "email link")}
              className="hover:text-gold"
            >
              bsmanikanta2004@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
