import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-DbBCv9kS.js";
import { g as getContactDetails, C as CONTACT_DETAILS_DEFAULTS, a as SITE_CONTENT_CHANGED_EVENT, S as SiteLayout, M as Mail, P as Phone, L as Linkedin, I as Instagram, b as SITE_CONTENT_KEY } from "./SiteLayout-fmTsCViQ.js";
import { P as PageHero } from "./PageHero-B3UZJ5gb.js";
import { u as useAuth, t as toast } from "./router-BUJDySKP.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
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
