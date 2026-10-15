import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
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
