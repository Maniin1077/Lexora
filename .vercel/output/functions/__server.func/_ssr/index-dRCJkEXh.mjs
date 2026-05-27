import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as getHomeHeroContent, H as HOME_HERO_DEFAULTS, a as SITE_CONTENT_CHANGED_EVENT, S as SiteLayout, q as logo, b as SITE_CONTENT_KEY } from "./SiteLayout-CNsRNPbk.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowRight, q as Mic, F as FileText, G as Globe, r as Award, s as BookOpen } from "../_libs/lucide-react.mjs";
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
import "./router-DqURmC3W.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const highlights = [{
  icon: Mic,
  title: "Debates & Seminars",
  text: "Sharpen reasoning through structured academic discourse."
}, {
  icon: FileText,
  title: "Blogs & Magazines",
  text: "Publish research-driven writing on law and policy."
}, {
  icon: Globe,
  title: "Conferences & Webinars",
  text: "Engage with practitioners and scholars across India."
}, {
  icon: Award,
  title: "Internships",
  text: "Earn certificates, LoRs and real publication credits."
}];
function HomePage() {
  const [hero, setHero] = reactExports.useState(() => getHomeHeroContent({
    ...HOME_HERO_DEFAULTS,
    image: logo
  }));
  reactExports.useEffect(() => {
    const load = () => {
      setHero(getHomeHeroContent({
        ...HOME_HERO_DEFAULTS,
        image: logo
      }));
    };
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", style: {
      background: "var(--gradient-hero)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-30", style: {
        backgroundImage: "radial-gradient(circle at 15% 25%, oklch(0.72 0.13 75 / 0.45), transparent 45%), radial-gradient(circle at 85% 75%, oklch(0.72 0.13 75 / 0.3), transparent 50%)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-primary-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-gold", children: hero.motto }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-5 font-display text-5xl font-medium leading-tight md:text-7xl", children: [
            hero.titleLineOne,
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "that ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-gold", children: hero.titleAccent })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-lg text-primary-foreground/80", children: hero.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/internships", className: "group inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-medium text-navy-deep shadow-gold transition hover:translate-y-[-2px]", style: {
              background: "var(--gradient-gold)"
            }, children: [
              hero.primaryCtaText,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "inline-flex items-center gap-2 rounded-md border border-gold/40 px-6 py-3.5 text-sm font-medium text-primary-foreground hover:bg-gold/10", children: hero.secondaryCtaText })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center md:justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full blur-3xl", style: {
            background: "var(--gradient-gold)",
            opacity: 0.4
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-72 w-72 overflow-hidden rounded-full ring-4 ring-gold/30 md:h-96 md:w-96", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: hero.image, alt: "Lexora Community emblem", className: "h-full w-full scale-[1.08] object-cover" }) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-14 max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-accent", children: "What we do" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-4xl text-primary md:text-5xl", children: "A learning ecosystem, by students for students." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4", children: highlights.map(({
        icon: Icon,
        title,
        text
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-xl border border-border bg-card p-7 transition hover:border-gold hover:shadow-elegant", style: {
        boxShadow: "var(--shadow-elegant)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-12 w-12 items-center justify-center rounded-lg", style: {
          background: "var(--gradient-gold)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-navy-deep" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-display text-xl text-primary", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: text })
      ] }, title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-secondary/40 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-accent", children: "Why Lexora" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-4xl text-primary md:text-5xl", children: "Grow collectively as influence widens." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-muted-foreground", children: "Lexora is more than a group — it is an ecosystem of collaboration, credibility, and continuous learning. Your participation shapes the culture." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/members", className: "mt-8 inline-flex items-center gap-2 font-medium text-primary hover:text-accent", children: [
          "Meet the team ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4", children: ["Enhance your LinkedIn presence with verifiable contributions", "Strengthen your CV through meaningful research initiatives", "Expand a multidisciplinary network across India", "Earn certificates, letters of recommendation and publications"].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-4 rounded-lg border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm text-gold", children: i + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/85", children: item })
      ] }, item)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl px-10 py-16 text-center text-primary-foreground md:px-16", style: {
      background: "var(--gradient-hero)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "mx-auto h-10 w-10 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-5 font-display text-4xl md:text-5xl", children: "Ready to contribute & grow?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-4 max-w-xl text-primary-foreground/75", children: "Applications for the Research Internship are open on a rolling basis." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/internships", className: "mt-8 inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-sm font-medium text-navy-deep", style: {
        background: "var(--gradient-gold)"
      }, children: [
        "View Internship Details ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }) })
  ] });
}
export {
  HomePage as component
};
