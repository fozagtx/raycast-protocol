import path from "node:path"
import { fileURLToPath } from "node:url"

const appDir = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: appDir,
    resolveAlias: {
      "@react-native-async-storage/async-storage": path.join(
        appDir,
        "src/app/shims/empty-module.ts",
      ),
    },
  },
}

export default nextConfig
