const slugify = (string: string, delimiter = '-') =>
	string
		.replace(/[\s\:\/\?#@\[\]\-_!\$&'\(\)\*\+\.\,;=]+/g, ' ') // eslint-disable-line
		.trim()
		.replace(/\s+/g, delimiter)
		.toLowerCase() || delimiter.repeat(string.length)

export default slugify
