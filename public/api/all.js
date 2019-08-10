(() => {
	addScriptTagToHead('highlight')

	function addScriptTagToHead(src) {
		const script = document.createElement('script')
		script.src = `https://memorize.ai/api/${src}`
		document.head.appendChild(script)
	}
})()