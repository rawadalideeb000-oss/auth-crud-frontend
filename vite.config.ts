import react from '@vitejs/plugin-react' // Import the plugin that lets Vite process React components.
import tailwindcss from '@tailwindcss/vite' // Import Tailwind's Vite plugin; this is installed through pnpm, not a local file.
import { defineConfig } from 'vite' // { defineConfig } is a named import: a helper that gives this configuration TypeScript support.

// WHY the Vite plugin? This project already uses Vite, so Tailwind can run as part of its existing build.
// A PostCSS setup is another option, but it would add configuration this project does not need.
export default defineConfig({ // Export this settings object as the configuration Vite should load.
  plugins: [react(), tailwindcss()], // [] is an array. Calling each imported function with () creates the plugins Vite will use.
})
