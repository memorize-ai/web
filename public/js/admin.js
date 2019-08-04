document.addEventListener('DOMContentLoaded', () => {
	const firestore = firebase.firestore()

	let functions = []
	
	firestore.collection('admin-functions').onSnapshot(snapshot =>
		snapshot.docChanges().forEach(change => {
			const doc = change.doc
			const id = doc.id
			const newData = () => ({
				id,
				name: doc.get('name'),
				inputs: Object.entries(doc.get('inputs')).map(([id, input]) => Object.assign(input, { id }))
			})
			switch (change.type) {
			case 'added':
				functions.push(newData())
				break
			case 'modified':
				for (let i = 0; i < functions.length; i++)
					if (functions[i].id === id) {
						functions[i] = newData()
						break
					}
				break
			case 'removed':
				functions = functions.filter(fn => fn.id !== id)
				break
			}
			functionsChanged()
		})
	)

	function functionsChanged() {
		console.log(functions)
	}
})