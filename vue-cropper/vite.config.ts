import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const basePath = fileURLToPath(new URL("./src", import.meta.url));
  const config: UserConfig = {
    plugins: [vue()],
    resolve: {
      alias: {
        //"@": resolve(__dirname, "src"),
        // '@': path.resolve(__dirname, './src'),
        "@": basePath,
      },
    },
    publicDir: false,
    build: {
      minify: "esbuild",
      lib: {
        entry: basePath,
        //entry: './src/index.js',  // Your library entry file
        name: 'VueCropper',     // Global variable name for UMD
        formats: ["es", /*"cjs", "umd", "iife"*/],
        //fileName: (format) => `index.${format}.js`,
        fileName: "index",
      },
      rollupOptions: {
        external: ['vue'], // Externalize Vue dependency
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
      outDir: "dist/lib",
    }
  }
  return config
})
