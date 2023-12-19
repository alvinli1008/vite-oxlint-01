import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import vitePluginImp from "vite-plugin-imp";
import tailwindcss from "tailwindcss";
import postcssImport from "postcss-import";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";
import path from "path";
import { createStyleImportPlugin } from "vite-plugin-style-import";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: /^~/, replacement: "" }],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "@base-font-size": 16,
        },
        javascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [
        postcssImport,
        autoprefixer,
        postcssPresetEnv({
          features: {
            "logical-properties-and-values": false,
          },
        }),
        tailwindcss,
      ],
    },
  },
  plugins: [
    react(),
    createStyleImportPlugin({
      resolves: [],
      libs: [
        // 如果没有你需要的resolve，可以在lib内直接写，也可以给我们提供PR
        {
          libraryName: "@arco-design/mobile-react",
          esModule: true,
          resolveStyle: (name) => {
            return `@arco-design/mobile-react/esm/${name}/style/index.js`;
          },
        },
      ],
    }),
    // vitePluginImp({
    //   libList: [
    //     {
    //       libName: "@arco-design/mobile-react",
    //       style: (name) => `@arco-design/mobile-react/esm/${name}/style/index.js`,
    //     },
    //   ],
    // }),
  ],
});
