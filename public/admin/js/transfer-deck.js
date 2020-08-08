const emailInput = document.getElementById('email-input')
const urlInput = document.getElementById('url-input')
const keyInput = document.getElementById('key-input')

const submitButton = document.getElementById('submit-button')
const statusText = document.getElementById('status-text')

const onInput = () => {
	submitButton.disabled = !(emailInput.value && urlInput.value && keyInput.value)
}

const onSubmit = async event => {
	event.preventDefault()
	
	try {
		const response = await fetch('https://memorize.ai/_api/admin/transfer-deck', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${keyInput.value}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: emailInput.value,
				url: urlInput.value
			})
		})
		
		const { status } = response
		const text = await response.text()
		
		statusText.innerHTML = text
	} catch (error) {
		console.error(error)
	}
}
