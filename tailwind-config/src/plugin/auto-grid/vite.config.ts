import { defineConfig, UserConfig } from 'vite'
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const basePath = fileURLToPath(new URL("./", import.meta.url));
  const config: UserConfig = {
    plugins: [
    ],
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
        name: 'Native',     // Global variable name for UMD
        formats: ["es", /*"cjs", "umd", "iife"*/],
        //fileName: (format) => `index.${format}.js`,
        fileName: "index",
      },
      rollupOptions: {
        
      },
      outDir: "dist/lib",
    }
  }
  return config
})
