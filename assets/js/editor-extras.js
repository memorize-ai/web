ClassicEditor
	.create(document.getElementById('editor'), {
		simpleUpload: {
			uploadUrl: '\(WEB_URL)/_api/upload-deck-asset?deck=\(deckId)'
		},
		autosave: {
			save: editor =>
				webkit.messageHandlers.data.postMessage(editor.getData())
		}
	})
	.then(editor =>
		editor.ui.focusTracker.on('change:isFocused', (_event, _name, isFocused) =>
			isFocused
				? setTimeout(() => scrollTo(0, 0), 150)
				: null
		)
	)
	.catch(error =>
		webkit.messageHandlers.error.postMessage(error.toString())
	)
