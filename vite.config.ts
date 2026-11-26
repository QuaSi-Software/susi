import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json' with { type: 'json' };

// https://vite.dev/config/
export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		port: 5002,
	},
	build: {
		rollupOptions: {
			external: ['web-worker'],
			output: {
				globals: {
					'web-worker': 'undefined',
				},
			},
		},
	},
});
