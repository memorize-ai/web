document.addEventListener('DOMContentLoaded', () => {
	const UID_COOKIE = '__memorize-ai-uid'
	const NAME_COOKIE = '__memorize-ai-name'
	const TOKEN_COOKIE = '__memorize-ai-token'

	function getCookie(name) {
		const cookies = document.cookie.match(`(^|[^;]+)\\s*${name}\\s*=\\s*([^;]+)`)
		return cookies ? cookies.pop() : undefined
	}
	
	function setCookie(name, value) {
		document.cookie = `${name}=${value}; expires=Thu, 01 Jan 3000 00:00:00 GMT`
	}
	
	function removeCookie(name) {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
	}
	
	function mouseUp(event) {
		const selectedText = getSelectedText()
		if (!selectedText.length) return
		showModal(selectedText, event)
	}

	function callOnModals(fn) {
		document.querySelectorAll('div.__memorize-ai-highlight-modal.__memorize-ai-protected').forEach(fn)
	}

	function showModal(text, event) {
		hideModal()
		const div = document.createElement('div')
		div.classList.add('__memorize-ai-highlight-modal')
		div.classList.add('__memorize-ai-protected')
		if (getCookie(UID_COOKIE)) {

		} else {
			div.innerHTML = '<a href="https://memorize.ai/sign-up?from=create-card" target="_blank">Sign up</a><br><br><a class="__memorize-ai-create-card-sign-in __memorize-ai-protected">Sign in</a>'
		}
		div.style.left = `${event.clientX}px`
		div.style.top = `${event.clientY}px`
		div.style.position = 'absolute'
		document.querySelector('*').append(div)
	}

	function hideModal() {
		callOnModals(element => document.querySelector('*').removeChild(element))
	}

	function getSelectedText() {
		return (document.all ? document.selection.createRange().text : document.getSelection()).toString()
	}

	document.querySelectorAll('.memorize-ai-highlightable').forEach(element => element.onmouseup = mouseUp)
	document.querySelectorAll('.memorize-ai-show-create-card-modal').forEach(element => element.addEventListener('click', event => showModal(null, event)))
})