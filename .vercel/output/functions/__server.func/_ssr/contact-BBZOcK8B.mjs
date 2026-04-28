import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as getContactDetails, C as CONTACT_DETAILS_DEFAULTS, a as SITE_CONTENT_CHANGED_EVENT, S as SiteLayout, b as SITE_CONTENT_KEY } from "./SiteLayout-CZzDtHch.mjs";
import { P as PageHero } from "./PageHero-Dj5pSq6L.mjs";
import { u as useAuth } from "./router-1DFd5Wq9.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as Mail, d as Phone, L as Linkedin, I as Instagram } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function ContactPage() {
  const {
    user
  } = useAuth();
  const [contact, setContact] = reactExports.useState(() => getContactDetails({
    ...CONTACT_DETAILS_DEFAULTS
  }));
  reactExports.useEffect(() => {
    const load = () => setContact(getContactDetails({
      ...CONTACT_DETAILS_DEFAULTS
    }));
    load();
    const onStorage = (event) => {
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
  const requireLoginForExternal = (e, label) => {
    if (user) return;
    e.preventDefault();
    toast.error("Please sign in first", {
      description: `You must be logged in to open ${label}.`,
      action: {
        label: "Sign in",
        onClick: () => window.location.href = "/login"
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { contentKey: "contact", eyebrow: "Get in Touch", title: "Contact Us", subtitle: "Questions, collaborations, or want to join the community? Reach out — we read every message." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-5xl px-6 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `mailto:${contact.email}`, onClick: (e) => requireLoginForExternal(e, "email link"), className: "group rounded-xl border border-border bg-card p-8 transition hover:border-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-7 w-7 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-2xl text-primary", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-foreground/85 group-hover:text-accent", children: contact.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-7 w-7 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-2xl text-primary", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-foreground/85", children: [
            contact.phonePrimaryLabel,
            " — ",
            contact.phonePrimaryNumber
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground/85", children: [
            contact.phoneSecondaryLabel,
            " — ",
            contact.phoneSecondaryNumber
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: contact.linkedInUrl, target: "_blank", rel: "noreferrer", onClick: (e) => requireLoginForExternal(e, "LinkedIn"), className: "group rounded-xl border border-border bg-card p-8 transition hover:border-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-7 w-7 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-2xl text-primary", children: "LinkedIn" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-foreground/85 group-hover:text-accent", children: contact.linkedInLabel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: contact.instagramUrl, target: "_blank", rel: "noreferrer", onClick: (e) => requireLoginForExternal(e, "Instagram"), className: "group rounded-xl border border-border bg-card p-8 transition hover:border-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-7 w-7 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-2xl text-primary", children: "Instagram" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-foreground/85 group-hover:text-accent", children: contact.instagramLabel })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-14 rounded-2xl p-10 text-center text-primary-foreground", style: {
        background: "var(--gradient-hero)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-3xl", children: "Join an ecosystem that lifts together." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-primary-foreground/75", children: "Explore active opportunities and become part of Lexora." })
      ] })
    ] })
  ] });
}
export {
  ContactPage as component
};
