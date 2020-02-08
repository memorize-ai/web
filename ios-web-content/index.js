const { join } = require('path')
const {
	mkdirSync: mkdir,
	readFileSync: readFile,
	writeFileSync: writeFile
} = require('fs')

const minifyCss = require('uglifycss').processString
const minifyJs = require('babel-minify')

mkdir(join(__dirname, 'lib'))

const bundles = {
	display: {
		css: [
			readFile(join(__dirname, 'src/display/css/ckeditor-content-styles.css')).toString(),
			readFile(join(__dirname, 'src/display/css/katex.css')).toString(),
			readFile(join(__dirname, 'src/display/css/prism.css')).toString(),
			readFile(join(__dirname, 'src/display/css/custom.css')).toString()
		],
		js: [
			readFile(join(__dirname, 'src/display/js/katex.js')).toString(),
			readFile(join(__dirname, 'src/display/js/auto-render.js')).toString(),
			readFile(join(__dirname, 'src/display/js/prism.js')).toString()
		]
	},
	editor: {
		css: [
			readFile(join(__dirname, 'src/editor/css/custom.css')).toString()
		],
		js: [
			readFile(join(__dirname, 'src/editor/js/ckeditor.js')).toString()
		]
	}
}

for (const bundle of ['display', 'editor']) {
	mkdir(join(__dirname, `lib/${bundle}`))
	
	const { css, js } = bundles[bundle]
	
	writeFile(
		join(__dirname, `lib/${bundle}/index.css`),
		minifyCss(css.join('\n'))
	)
	writeFile(
		join(__dirname, `lib/${bundle}/index.js`),
		minifyJs(js.join('\n'), { mangle: false }).code || ''
	)
}
