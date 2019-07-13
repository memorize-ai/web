isSignedInHandler = signedIn =>
	signedIn
		? document.querySelectorAll('.navbar-end-auth-buttons').forEach(element => element.classList.add('is-hidden'))
		: null