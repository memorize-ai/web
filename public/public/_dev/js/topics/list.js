const list = document.getElementById('topic-list')

let topics = []

const reloadTopicList = () => {
	while (list.firstChild)
		list.removeChild(list.lastChild)
	topics.forEach(topic => {
		const li = document.createElement('li')
		li.style.width = '100px'
		li.style.height = '100px'
		li.style.display = 'inline-block'
		li.innerHTML = `<img src="${topic.image}" alt="${topic.name}" width="80px" height="80px"><br><p>${topic.name}</p>`
		list.appendChild(li)
	})
}

const addTopicToList = topic => {
	topics = [...topics, topic].sort((a, b) => a.name.localeCompare(b.name))
	reloadTopicList()
}

const removeTopicFromList = id => {
	topics = topics.filter(topic => topic.id !== id)
	reloadTopicList()
}

firestore.collection('topics').onSnapshot(snapshot =>
	snapshot.docChanges().forEach(change => {
		const { doc, type } = change
		const { id } = doc
		switch (type) {
			case 'added':
				storage.child(`topics/${id}`).getDownloadURL().then(image =>
					addTopicToList({
						id,
						name: doc.get('name'),
						image
					})
				)
				break
			case 'removed':
				removeTopicFromList(id)
				break
		}
	})
)
