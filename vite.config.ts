import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export default defineConfig({
  cloudflare: false,
  plugins: [nitro({ preset: "vercel" })],
  vite: {
    base: "/",
    resolve: {
      alias: {
        tslib: resolve(fileURLToPath(new URL(".", import.meta.url)), "src/shims/tslib.ts"),
      },
    },
    ssr: {
      noExternal: ["tslib"],
    },
  },
});