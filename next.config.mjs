import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import createNextIntlPlugin from "next-intl/plugin";
import remarkGfm from "remark-gfm";
import redirects from "./redirects.mjs";
import { createHighlighter, bundledLanguages } from "shiki";

import sbpfGrammar from "./src/lib/shiki/sbpf-grammar.json" with { type: "json" };
import blueshiftTheme from "./src/lib/shiki/blueshift-theme.json" with { type: "json" };

const nextConfig = {
  async redirects() {
    return redirects;
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore type errors during build to avoid out of memory issues
    // Type checking can be done separately with: npx tsc --noEmit
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
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

    // Important: return the modified config
    return config;
  },
  poweredByHeader: false,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          getHighlighter: (options) => {
            return createHighlighter({
              ...options,
              langs: [
                ...Object.values(bundledLanguages),
                {
                  name: "sbpf-asm",
                  aliases: ["sbpf", "sbpfasm", "sbf", "ebpf"],
                  ...sbpfGrammar,
                },
              ],
              themes: [blueshiftTheme],
            });
          },
          theme: "blueshift",
          // aurora-x
          keepBackground: false,
          transformers: [
            {
              span(node) {
                if (
                  this.options.lang === "bash" ||
                  this.options.lang === "sh"
                ) {
                  delete node.properties.style;
                }
              },
            },
          ],
        },
      ],
    ],
  },
});

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withMDX(nextConfig));

// NOTE: Cloudflare initialization is commented out due to Miniflare runtime failures on Windows
// If you need Cloudflare Workers features in development, you may need to:
// 1. Use WSL2 (Windows Subsystem for Linux) instead of native Windows
// 2. Or only enable this when deploying to Cloudflare (it's not needed for local Next.js dev)
// 
// Uncomment the following if you need getCloudflareContext() in development:
// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
// await initOpenNextCloudflareForDev();
