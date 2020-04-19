const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const mjml2html = require('mjml')

if (require.main === module)
	writeFileSync(
		join(__dirname, 'index.html'),
		mjml2html(readFileSync(join(__dirname, 'index.mjml')).toString(), {
			validationLevel: 'strict',
			minify: true
		}).html
	)
