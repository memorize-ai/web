(() => {
	const signUpButton = document.querySelector('.navbar-auth-button.sign-up')
	const signInButton = document.querySelector('.navbar-auth-button.sign-in')
	const signOutButton = document.querySelector('.navbar-auth-button.sign-out')
	const path = location.pathname

	if (cookie('uid')) {
		signUpButton.classList.add('is-hidden')
		signInButton.classList.add('is-hidden')
		signOutButton.classList.remove('is-hidden')
	} else {
		signUpButton.classList.remove('is-hidden')
		signInButton.classList.remove('is-hidden')
		signOutButton.classList.add('is-hidden')
	}

	function goToSignUp() {
		switch (path) {
		case '/sign-up':
			return location.reload()
		case '/sign-in':
			const from = new URLSearchParams(location.search).get('from')
			return location.href = `/sign-up${from ? `?from=${encodeURIComponent(from)}` : ''}`
		default:
			location.href = `/sign-up?from=${encodeURIComponent(location.href)}`
		}
	}

	function goToSignIn() {
		switch (path) {
		case '/sign-in':
			return location.reload()
		case '/sign-up':
			const from = new URLSearchParams(location.search).get('from')
			return location.href = `/sign-in${from ? `?from=${encodeURIComponent(from)}` : ''}`
		default:
			location.href = `/sign-in?from=${encodeURIComponent(location.href)}`
		}
	}

	signUpButton.addEventListener('click', goToSignUp)
	signInButton.addEventListener('click', goToSignIn)
})()