let isSignedInHandler;

document.addEventListener('DOMContentLoaded', () =>
	firebase.auth().onAuthStateChanged(user =>
		isSignedInHandler ? isSignedInHandler(user !== null) : null
	)
)