import { U as jsxRuntimeExports } from "./worker-entry-LzKgK4ed.js";
import { c as createLucideIcon, S as SiteLayout } from "./SiteLayout-6lkPLzPj.js";
import { P as PageHero } from "./PageHero-P2bbLUwC.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-tfM_rQOp.js";
const __iconNode$2 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Target = createLucideIcon("target", __iconNode);
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
