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

const deleteTopic = () => {
	deleteTopicButton.disabled = true
	deleteTopicLoadingIndicator.hidden = false
	const topicName = deleteTopicNameInput.value
	firestore.collection('topics').where('name', '==', topicName).get().then(({ empty, docs }) =>
		empty
			? Promise.reject(`There are no topics with the name "${topicName}"`)
			: deleteTopicWithDocument(docs[0])
	).then(() =>
		deleteTopicNameInput.value = ''
	).catch(reason => {
		deleteTopicButton.disabled = false
		alert(reason)
	}).finally(() =>
		deleteTopicLoadingIndicator.hidden = true
	)
}
