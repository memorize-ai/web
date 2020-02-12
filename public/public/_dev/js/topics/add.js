const addTopicFileInput = document.getElementById('add-topic-file-input')
const addTopicNameInput = document.getElementById('add-topic-name-input')
const addTopicButton = document.getElementById('add-topic-button')
const addTopicLoadingIndicator = document.getElementById('add-topic-loading-indicator')

const onAddTopicInputChange = () =>
	addTopicButton.disabled = !(addTopicFileInput.files.length && addTopicNameInput.value)

const addTopic = async () => {
	addTopicButton.disabled = true
	addTopicLoadingIndicator.hidden = false
	
	const documentReference = firestore.collection('topics').doc()
	
	try {
		await storage.child(`topics/${documentReference.id}`).put(addTopicFileInput.files[0])
		
		await documentReference.set({
			name: addTopicNameInput.value
		})
		
		addTopicFileInput.value = null
		addTopicNameInput.value = ''
	} catch (error) {
		addButton.disabled = false
		console.error(error)
		alert(error)
	} finally {
		addTopicLoadingIndicator.hidden = true
	}
}
