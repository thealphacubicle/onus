/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["geist"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons",
      },
    ],
  },
};

export default nextConfig;
