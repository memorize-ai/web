const deckId = new URLSearchParams(window.location.search).get('id') || 'abc'
const fbListenDeck = app =>
	firebase.firestore().collection('decks').doc(deckId)
		.onSnapshot(doc =>
			app.ports.updateDeck.send(Object.assign({photoUrl: null}, doc.data()))
		)

const userFromFirebase = fbUser =>
	({ name: fbUser.displayName || 'Temporarily Unknown'
		, uid: fbUser.uid
		})

const updateUser = app => user =>
	user && app.ports.updateUser.send(userFromFirebase(user))

document.addEventListener('DOMContentLoaded', function() {
	const app = Elm.Page.Deck.init({flags: deckId})
	firebase.auth().onAuthStateChanged(updateUser(app))
	listenSignOut(app)
	fbListenDeck(app)
	setTimeout(startSearch, 100)
})