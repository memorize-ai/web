document.addEventListener('DOMContentLoaded', () => {
	const UID_COOKIE = '__memorize-ai-uid'
	const NAME_COOKIE = '__memorize-ai-name'
	const TOKEN_COOKIE = '__memorize-ai-token'

	function mouseUp() {
		
	}

	function mouseDown() {
		
	}

	function getSelectedText() {
		return document.all ? document.selection.createRange().text : document.getSelection()
	}

	document.querySelectorAll('.memorize-ai-highlightable').forEach(element => element.onmouseup = mouseUp)
	document.onmousedown = mouseDown
})