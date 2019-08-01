document.addEventListener('DOMContentLoaded', () => {
	const auth = firebase.auth()
	const signOutButton = document.querySelector('.navbar-auth-button.sign-out')

	function signOut() {
		signOutButton.classList.add('is-loading')
		auth.signOut().then(() => {
			signOutButton.classList.remove('is-loading')
			removeCookie('uid')
			location.reload()
		}).catch(() => {
			signOutButton.classList.remove('is-loading')
			alert('An error occurred. Please try again')
		})
	}

	signOutButton.addEventListener('click', signOut)
})