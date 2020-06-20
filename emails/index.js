const {
	mkdirSync: mkdir,
	writeFileSync: writeFile,
	readFileSync: readFile
} = require('fs')
const { join } = require('path')
const compile = require('mjml')

if (require.main === module) {
	const name = process.argv[2]
	
	if (!name)
		throw new Error('You must specify a filename')
	
	try { mkdir(join(__dirname, 'lib')) } catch {}
	
	writeFile(
		join(__dirname, `lib/${name}.html`),
		compile(
			readFile(join(__dirname, `src/${name}.mjml`)).toString(),
			{ validationLevel: 'strict', minify: true }
		).html
	)
	
	console.log(join(__dirname, `lib/${name}.html`))
}
