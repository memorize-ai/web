(() => {
	addScriptTagToHead('highlight')

	function addScriptTagToHead(src) {
		var script = document.createElement('script')
		script.src = `https://memorize.ai/api/${src}`
		document.head.appendChild()
	}
})()