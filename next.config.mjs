/** @type {import('next').NextConfig} */
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const isVercel = process.env.VERCEL === "1";

const nextConfig = {
  // Keep Vercel on the default `.next` output, but use `next-dist` locally on Windows
  // to avoid file locking issues during development.
  ...(isVercel ? {} : { distDir: "next-dist" }),
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
