import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SiteLayout } from "./SiteLayout-VfWkS54d.mjs";
import { P as PageHero } from "./PageHero-DZLzWKMJ.mjs";
import "../_libs/sonner.mjs";
import { p as Target, E as Eye, H as Heart } from "../_libs/lucide-react.mjs";
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
import "./router-CnQBulb0.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/@supabase/functions-js.mjs";
function AboutPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { contentKey: "about", eyebrow: "About Us", title: "Knowledge through collective contribution.", subtitle: "Lexora was founded with a singular purpose — to maximise the spread of knowledge with minimal individual burden." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-5xl px-6 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl leading-relaxed text-muted-foreground", children: [
        "We aim to build a dynamic, multidisciplinary ecosystem where students and young professionals from law, management, and allied domains come together to learn, grow, and elevate each other. Inspired by",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "text-primary", children: "Sa Vidyā Ya Vimuktaye" }),
        ' — "that knowledge which liberates" — Lexora creates meaningful academic and cultural engagement across campuses in India.'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 grid gap-6 md:grid-cols-3", children: [{
        icon: Target,
        title: "Our Mission",
        text: "Maximise the spread of knowledge through collective contribution and minimal individual burden."
      }, {
        icon: Eye,
        title: "Our Vision",
        text: "A dynamic, multidisciplinary ecosystem uniting law, management and allied domains."
      }, {
        icon: Heart,
        title: "Our Culture",
        text: "Collaboration, credibility, and continuous learning — a community that grows because everyone lifts together."
      }].map(({
        icon: Icon,
        title,
        text
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-12 w-12 items-center justify-center rounded-lg", style: {
          background: "var(--gradient-gold)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-navy-deep" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-display text-2xl text-primary", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: text })
      ] }, title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-20 rounded-2xl border border-gold/30 bg-secondary/40 p-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-3xl text-primary", children: "Our Presence" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Lexora's contributions reach students through leading academic and legal platforms across India." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap gap-3", children: ["LinkedIn", "Instagram", "Lawctopus", "Unstop", "LawBhoomi"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-gold/40 bg-background px-5 py-2 text-sm font-medium text-primary", children: p }, p)) })
      ] })
    ] })
  ] });
}
export {
  AboutPage as component
};
