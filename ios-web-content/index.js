const { join } = require('path')
const {
	mkdirSync: mkdir,
	readFileSync: readFile,
	writeFileSync: writeFile
} = require('fs')
const babelMinify = require('babel-minify')

const minifyCSS = require('uglifycss').processFiles

const minifyJS = paths =>
	babelMinify(
		paths.map(path => readFile(path, 'utf8')).join('\n'),
		{ mangle: false }
	).code || '' 

mkdir(join(__dirname, 'lib'))

const bundles = {
	display: {
		css: [
			join(__dirname, 'src/display/css/ckeditor-content-styles.css'),
			join(__dirname, 'src/display/css/katex.css'),
			join(__dirname, 'src/display/css/prism.css'),
			join(__dirname, 'src/display/css/custom.css')
		],
		js: [
			join(__dirname, 'src/display/js/katex.js'),
			join(__dirname, 'src/display/js/auto-render.js'),
			join(__dirname, 'src/display/js/prism.js')
		]
	},
	editor: {
		css: [
			join(__dirname, 'src/editor/css/custom.css')
		],
		js: [
			join(__dirname, 'node_modules/ckeditor5-memorize.ai/build/ckeditor.js')
		]
	}
}

for (const [bundle, { css, js }] of Object.entries(bundles)) {
	mkdir(join(__dirname, `lib/${bundle}`))
	
	writeFile(
		join(__dirname, `lib/${bundle}/index.css`),
		minifyCSS(css)
	)
	
	writeFile(
		join(__dirname, `lib/${bundle}/index.js`),
		minifyJS(js)
	)
}
