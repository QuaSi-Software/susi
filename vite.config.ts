import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		esbuildOptions: {
			supported: {
				bigint: true,
			},
		},
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

