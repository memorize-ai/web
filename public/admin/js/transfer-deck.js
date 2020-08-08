const emailInput = document.getElementById('email-input')
const urlInput = document.getElementById('url-input')
const keyInput = document.getElementById('key-input')
const submitButton = document.getElementById('submit-button')

const onInput = () => {
	submitButton.disabled = !(emailInput.value && urlInput.value && keyInput.value)
}

const onSubmit = event => {
	event.preventDefault()
}
