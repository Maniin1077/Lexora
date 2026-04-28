import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { h as getPageHeroContent, a as SITE_CONTENT_CHANGED_EVENT, b as SITE_CONTENT_KEY } from "./SiteLayout-Dt65AXE2.mjs";
function PageHero({
  eyebrow,
  title,
  subtitle,
  contentKey
}) {
  const [content, setContent] = reactExports.useState(() => {
    if (!contentKey) {
      return { eyebrow, title, subtitle };
    }
    return getPageHeroContent(contentKey, { eyebrow, title, subtitle });
  });
  reactExports.useEffect(() => {
    if (!contentKey) {
      setContent({ eyebrow, title, subtitle });
      return;
    }
    const load = () => {
      setContent(getPageHeroContent(contentKey, { eyebrow, title, subtitle }));
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
  }, [contentKey, eyebrow, title, subtitle]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "relative overflow-hidden",
      style: { background: "var(--gradient-hero)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 opacity-20",
            style: {
              backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.72 0.13 75 / 0.4), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.72 0.13 75 / 0.25), transparent 50%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-5xl px-6 py-24 text-center text-primary-foreground", children: [
          content.eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-gold", children: content.eyebrow }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-display text-5xl md:text-6xl font-medium", children: content.title }),
          content.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/75", children: content.subtitle })
        ] })
      ]
    }
  );
}
export {
  PageHero as P
};
