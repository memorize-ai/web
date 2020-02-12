const deleteTopicNameInput = document.getElementById('delete-topic-name-input')
const deleteTopicButton = document.getElementById('delete-topic-button')
const deleteTopicLoadingIndicator = document.getElementById('delete-topic-loading-indicator')

const onDeleteTopicInputChange = () =>
	deleteTopicButton.disabled = !deleteTopicNameInput.value
	
const deleteTopicWithDocument = ({ id, ref }) =>
	Promise.all([
		ref.delete(),
		storage.child(`topics/${id}`).delete()
	])

const deleteTopic = async () => {
	deleteTopicButton.disabled = true
	deleteTopicLoadingIndicator.hidden = false
	
	const topicName = deleteTopicNameInput.value
	
	try {
		const { empty, docs } = await firestore.collection('topics').where('name', '==', topicName).get()
		
		if (empty)
			throw new Error(`There are no topics with the name "${topicName}"`)
		
		await deleteTopicWithDocument(docs[0])
		
		deleteTopicNameInput.value = ''
	} catch (error) {
		deleteTopicButton.disabled = false
		alert(error)
	} finally {
		deleteTopicLoadingIndicator.hidden = true
	}
}
