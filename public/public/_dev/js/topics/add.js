const addTopicFileInput = document.getElementById('add-topic-file-input')
const addTopicNameInput = document.getElementById('add-topic-name-input')
const addTopicButton = document.getElementById('add-topic-button')
const addTopicLoadingIndicator = document.getElementById('add-topic-loading-indicator')

const onAddTopicInputChange = () =>
	addTopicButton.disabled = !(addTopicFileInput.files.length && addTopicNameInput.value)

const addTopic = () => {
	addTopicButton.disabled = true
	addTopicLoadingIndicator.hidden = false
	
	const documentReference = firestore.collection('topics').doc()
	
	storage.child(`topics/${documentReference.id}`).put(addTopicFileInput.files[0]).then(() =>
		documentReference.set({
			name: addTopicNameInput.value
		})
	).then(() => {
		addTopicFileInput.value = null
		addTopicNameInput.value = ''
	}).catch(reason => {
		addButton.disabled = false
		console.error(reason)
		alert(reason)
	}).finally(() =>
		addTopicLoadingIndicator.hidden = true
	)
}
