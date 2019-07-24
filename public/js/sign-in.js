document.addEventListener('DOMContentLoaded', () => {
	const auth = firebase.auth()
	const emailInput = document.querySelector('.email-input')
	const passwordInput = document.querySelector('.password-input')
	const signInButton = document.querySelector('.sign-in-button')
	const isSignedIn = cookie('uid') !== undefined

	if (isSignedIn)
		document.querySelector('.card-content .content').innerHTML = '<h1 class="title">You\'re already signed in!</h1><button class="button is-medium is-primary sign-out-button large-auth-button">Sign out</button>'

	auth.onAuthStateChanged(user =>
		!isSignedIn && user
			? handleSignIn(user)
			: null
	)

	function handleSignIn(user) {
		setLoading(signInButton, false)
		setCookie('uid', user.uid)
		location.href = '/'
	}

	function inputsAreValid() {
		return emailInput.value.length && passwordInput.value.length
	}

	function reloadSignInButton() {
		signInButton.disabled = !inputsAreValid()
	}

	function signIn() {
		if (inputsAreValid()) {
			setLoading(signInButton, true)
			auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value).catch(_error => {
				setLoading(signInButton, false)
				alert('Invalid email/password')
			})
		} else
			alert('You\'re not allowed to do that!')
	}

	function signOut() {
		const signOutButton = document.querySelector('.sign-out-button')
		if (!signOutButton) return
		setLoading(signOutButton, true)
		auth.signOut().then(() => {
			setLoading(signOutButton, false)
			removeCookie('uid')
			location.reload()
		}).catch(_error => {
			setLoading(signOutButton, false)
			alert('An error occurred. Please try again')
		})
	}

	function setLoading(element, isLoading) {
		if (isLoading)
			element.classList.add('is-loading')
		else
			element.classList.remove('is-loading')
	}

	signInButton.addEventListener('click', signIn)
	document.querySelectorAll('.sign-out-button').forEach(element => element.addEventListener('click', signOut))
	emailInput.addEventListener('input', reloadSignInButton)
	passwordInput.addEventListener('input', reloadSignInButton)
})