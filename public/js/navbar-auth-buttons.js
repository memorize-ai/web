(() => {
	const signUpButton = document.querySelector('.navbar-auth-button.sign-up')
	const signInButton = document.querySelector('.navbar-auth-button.sign-in')
	const signOutButton = document.querySelector('.navbar-auth-button.sign-out')

	if (cookie('uid')) {
		signUpButton.classList.add('is-hidden')
		signInButton.classList.add('is-hidden')
		signOutButton.classList.remove('is-hidden')
	} else {
		signUpButton.classList.remove('is-hidden')
		signInButton.classList.remove('is-hidden')
		signOutButton.classList.add('is-hidden')
	}
})()