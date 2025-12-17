import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact(), tailwindcss()],
	build: {
		lib: {
			entry: './src/widget.tsx',
			name: 'VariablexWidget',
			fileName: (format) => `variablex-widget.${format}.js`,
			formats: ['es', 'umd']
		},
		rollupOptions: {
			output: {
				assetFileNames: 'variablex-widget.[ext]'
			}
		}
	}
});
