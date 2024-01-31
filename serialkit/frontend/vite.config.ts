import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tsconfigPaths from "vite-tsconfig-paths";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte(), tsconfigPaths()],
	css: {
		postcss: {
			plugins: [
				autoprefixer({}), // add options if needed
			],
		},
	},
});
