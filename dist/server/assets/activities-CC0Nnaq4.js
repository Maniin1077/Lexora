import { U as jsxRuntimeExports } from "./worker-entry-LzKgK4ed.js";
import { c as createLucideIcon, S as SiteLayout } from "./SiteLayout-6lkPLzPj.js";
import { P as PageHero } from "./PageHero-P2bbLUwC.js";
import { U as Users } from "./users-CY845qiW.js";
import { C as Calendar } from "./calendar-CAjaGSiv.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-tfM_rQOp.js";
const __iconNode$4 = [
  ["path", { d: "M12 21V7", key: "gj6g52" }],
  ["path", { d: "m16 12 2 2 4-4", key: "mdajum" }],
  [
    "path",
    {
      d: "M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3",
      key: "8arnkb"
    }
  ]
];
const BookOpenCheck = createLucideIcon("book-open-check", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
];
const Briefcase = createLucideIcon("briefcase", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M13 21h8", key: "1jsn5i" }],
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode);
const items = [{
  icon: MessageSquare,
  title: "Debates",
  text: "Structured forums to argue, defend and refine positions on legal and policy questions."
}, {
  icon: PenLine,
  title: "Blog Writing",
  text: "Original, research-driven blogs published on Lexora's official platforms."
}, {
  icon: Users,
  title: "Seminars",
  text: "Interactive sessions led by students, faculty and invited domain experts."
}, {
  icon: Calendar,
  title: "Conferences",
  text: "Multi-disciplinary gatherings featuring academic and practitioner perspectives."
}, {
  icon: Video,
  title: "Webinars",
  text: "Online masterclasses and panels accessible to participants across the country."
}, {
  icon: Briefcase,
  title: "Internship Opportunities",
  text: "Rolling-basis research internships with certificates and letters of recommendation."
}, {
  icon: BookOpenCheck,
  title: "Monthly Magazines",
  text: "A curated monthly publication highlighting the best of community writing."
}];
function ActivitiesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { contentKey: "activities", eyebrow: "What We Do", title: "Our Activities", subtitle: "A wide range of academic and professional activities, designed to build knowledge and community simultaneously." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: items.map(({
      icon: Icon,
      title,
      text
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-xl border border-border bg-card p-8 transition hover:border-gold hover:-translate-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-gold transition group-hover:bg-gold group-hover:text-navy-deep", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-display text-2xl text-primary", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: text })
    ] }, title)) }) })
  ] });
}
export {
  ActivitiesPage as component
};
