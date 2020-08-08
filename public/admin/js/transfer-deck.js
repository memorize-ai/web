const emailInput = document.getElementById('email-input')
const urlInput = document.getElementById('url-input')
const keyInput = document.getElementById('key-input')

const submitButton = document.getElementById('submit-button')
const statusText = document.getElementById('status-text')

keyInput.value = localStorage.getItem('key') || ''

const onInput = () => {
	submitButton.disabled = !(emailInput.value && urlInput.value && keyInput.value)
}

const onSubmit = async event => {
	event.preventDefault()
	
	const key = keyInput.value
	
	statusText.removeAttribute('data-value')
	statusText.innerHTML = 'Loading...'
	
	try {
		const response = await fetch('https://memorize.ai/_api/admin/transfer-deck', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${key}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: emailInput.value,
				url: urlInput.value
			})
		})
		
		const success = response.status === 200
		
		statusText.setAttribute('data-value', success ? 'success' : 'error')
		statusText.innerHTML = await response.text()
		
		if (success)
			emailInput.value = urlInput.value = ''
	} catch (error) {
		statusText.setAttribute('data-value', 'error')
		statusText.innerHTML = error.message
	} finally {
		localStorage.setItem('key', key)
	}
}
