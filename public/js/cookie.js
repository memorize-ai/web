function cookie(name) {
	const cookies = document.cookie.match(`(^|[^;]+)\\s*${name}\\s*=\\s*([^;]+)`)
	return cookies ? cookies.pop() : undefined
}