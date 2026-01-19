import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import createNextIntlPlugin from "next-intl/plugin";
import redirects from "./redirects.mjs";

const canvasShimPath = fileURLToPath(new URL("./src/shims/canvas-shim.js", import.meta.url));

const nextConfig = {
  async redirects() {
    return redirects;
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      canvas: canvasShimPath, // ensure optional canvas import falls back to linkedom shim
    };

    config.module.rules.push({
      test: /\.d\.ts$/, // Target .d.ts files
      resourceQuery: /raw/, // Only when ?raw is in the import path
      type: "asset/source", // Import as a string
    });

    config.module.rules.push({
      test: /\.ts\.template$/, // Target .ts files
      resourceQuery: /raw/, // Only when ?raw is in the import path
      type: "asset/source", // Import as a string
    });

    // Copy precompiled MDX into the Next build output so server runtime can read it (Vercel)
    class CopyCompiledMdxPlugin {
      apply(compiler) {
        compiler.hooks.beforeRun.tapPromise(
          "CopyCompiledMdxPlugin",
          async () => {
            const source = join(process.cwd(), ".compiled-mdx");
            const target = join(process.cwd(), ".next", "compiled-mdx");

            if (!existsSync(source)) {
              return;
            }

            // Clean old target then copy fresh content
            await rm(target, { recursive: true, force: true });
            await mkdir(target, { recursive: true });
            await cp(source, target, { recursive: true });
          }
        );
      }
    }

    config.plugins = config.plugins ?? [];
    config.plugins.push(new CopyCompiledMdxPlugin());

    // Important: return the modified config
    return config;
  },
  poweredByHeader: false,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
// Only initialize Cloudflare when not deploying to Vercel
(async () => {
  if (process.env.VERCEL !== "1" && !process.env.VERCEL_ENV) {
    try {
      const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");
      await initOpenNextCloudflareForDev();
    } catch (error) {
      // Silently ignore if Cloudflare package is not available or fails to initialize
      // This allows the config to work on both Vercel and Cloudflare
    }
  }
})();
