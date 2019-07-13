let isSignedInHandler;

document.addEventListener('DOMContentLoaded', () =>
	firebase.auth().onAuthStateChanged(user =>
		authHandler ? authHandler(user !== undefined) : null
	)
)