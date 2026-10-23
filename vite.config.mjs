import {fileURLToPath, URL} from "node:url";

import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {watch} from "vite-plugin-watch";
import packageJson from "./package.json" with {type: "json"};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    watch({
      pattern: "src/prayers/**/*.toml",
      command: "node compilePrayers.mjs"
    })
  ],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version)
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  esbuild: {
    supported: {
      "top-level-await": true // browsers can handle top-level-await features
    }
  }
});
