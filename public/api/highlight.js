(() => {
	function mouseUp() {
		
	}

	function getSelectedText() {
		return document.all ? document.selection.createRange().text : document.getSelection()
	}

	document.querySelectorAll('.memorize-ai-highlightable').forEach(element => element.onmouseup = mouseUp)
})()