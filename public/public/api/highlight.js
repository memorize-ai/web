(() => {
	const getSelectedText = () =>
		document.getSelection().toString()
	
	const showPopUp = text =>
		void window.open(
			`http://localhost:3000/create-card-pop-up?${
				text ? `text=${encodeURIComponent(text)}&` : ''
			}from=${
				encodeURIComponent(window.location.href)
			}`,
			'popup',
			'width=600,height=800'
		)
	
	const onMouseUp = () => {
		const selectedText = getSelectedText()
		selectedText && showPopUp(selectedText)
	}
	
	const reloadHighlightable = () =>
		document
			.querySelectorAll('.mai-hl')
			.forEach(element =>
				element.addEventListener('mouseup', onMouseUp)
			)
	
	const reloadShowCreateCardPopUp = () =>
		document
			.querySelectorAll('.mai-create-card')
			.forEach(element =>
				element.addEventListener('click', () => showPopUp())
			)
	
	window.mai = {
		...window.mai,
		showCreateCardPopUp: showPopUp,
		reloadHighlightable,
		reloadShowCreateCardPopUp
	}
	
	document.addEventListener('DOMContentLoaded', () => {
		reloadHighlightable()
		reloadShowCreateCardPopUp()
	})
})()
