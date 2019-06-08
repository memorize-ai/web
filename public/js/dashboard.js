const fbListenMyDecks = app => user =>
	firebase.firestore().collection('users').doc(user.uid).collection('decks')
		.onSnapshot(snapshot =>
			snapshot.forEach(doc =>
				app.ports.addMyDeck.send(doc.data())
			)
		)

const userFromFirebase = fbUser =>
	({ name: fbUser.displayName || 'Temporarily Unknown'
		, uid: fbUser.uid
		})

const updateUser = app => user => {
	app.ports.updateUser.send(userFromFirebase(user))
	fbListenMyDecks(app)(user)
	setTimeout(startSearch, 100)
}

document.addEventListener('DOMContentLoaded', function() {
	const app = Elm.Page.Dashboard.init()
	firebase.auth().onAuthStateChanged(user =>
		user
			? updateUser(app)(user)
			: redirectToLogin('dashboard')
	)
	listenSignOut(app)
})