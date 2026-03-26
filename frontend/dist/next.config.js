import path from "node:path";
const nextConfig = {
    reactStrictMode: true,
    outputFileTracingRoot: path.join(__dirname, ".."),
};
export default nextConfig;
