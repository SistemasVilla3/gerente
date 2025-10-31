import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter(
		{fallback: 'index.html'}
	),
	paths: {
		base: '/produccion/GerenteVentas'
	},
	prerender: {
		entries: ['*']
		}
	}
};

export default config;
