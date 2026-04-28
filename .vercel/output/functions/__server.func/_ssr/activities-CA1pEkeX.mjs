import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SiteLayout } from "./SiteLayout-CZzDtHch.mjs";
import { P as PageHero } from "./PageHero-Dj5pSq6L.mjs";
import "../_libs/sonner.mjs";
import { l as MessageSquare, m as PenLine, e as Users, C as Calendar, V as Video, n as Briefcase, o as BookOpenCheck } from "../_libs/lucide-react.mjs";
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
import "./router-1DFd5Wq9.mjs";
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
