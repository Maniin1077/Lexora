import { useEffect, useState } from "react";
import {
  getPageHeroContent,
  PageHeroKey,
  SITE_CONTENT_CHANGED_EVENT,
  SITE_CONTENT_KEY,
} from "@/lib/site-content";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  contentKey,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  contentKey?: PageHeroKey;
}) {
  const [content, setContent] = useState(() => {
    if (!contentKey) {
      return { eyebrow, title, subtitle };
    }

    return getPageHeroContent(contentKey, { eyebrow, title, subtitle });
  });

  useEffect(() => {
    if (!contentKey) {
      setContent({ eyebrow, title, subtitle });
      return;
    }

    const load = () => {
      setContent(getPageHeroContent(contentKey, { eyebrow, title, subtitle }));
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
  }, [contentKey, eyebrow, title, subtitle]);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, oklch(0.72 0.13 75 / 0.4), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.72 0.13 75 / 0.25), transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-6 py-16 text-center text-primary-foreground">
        {content.eyebrow && (
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            {content.eyebrow}
          </p>
        )}
        <h1 className="mt-4 font-display text-5xl md:text-6xl font-medium">
          {content.title}
        </h1>
        {content.subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/75">
            {content.subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
