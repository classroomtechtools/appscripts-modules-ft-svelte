import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import multi from '@rollup/plugin-multi-entry';

const production = !process.env.ROLLUP_WATCH;

export default [{
	input: 'src/modules/client/*.js',
	treeshake: true,
	output: {
		format: 'iife',
		file: './build/staging/clientBundle.ejs',
		banner: '<!-- Bundle from src/modules/client/ -->\n<script type="application/javascript">',
		footer: '</script>',
	},plugins: [
		multi(),
		resolve(),
		commonjs()
	]
}, {
	input: 'src/modules/server/*.js',
	treeshake: true,
	output: {
		format: 'cjs',
		file: './project/ServerBundles.js',
		banner: '/* Bundles as defined from all files in src/modules/*.js */\nconst Import = Object.create(null);\n',
		intro: '(function (exports) {',
		outro: '})(Import);'
	},plugins: [
		multi(),
		resolve(),
		commonjs()
	]
}, {
	input: 'src/svelte/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'build/svelte/bundle.js',
		plugins: [terser()]
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('build/svelte/bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `build` directory and refresh the
		// browser on changes when not in production
		!production && livereload('build/svelte'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}];

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
