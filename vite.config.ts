import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		port: 5002,
		proxy: {
			'/parameters': {
				target: 'http://vm-siz-sim-001.stzegs.ads:5000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/parameters/, '/parameters'),
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

