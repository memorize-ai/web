document.addEventListener('DOMContentLoaded', () => {
	const auth = firebase.auth()
	const firestore = firebase.firestore()
	const nameInput = document.querySelector('.name-input')
	const emailInput = document.querySelector('.email-input')
	const passwordInput = document.querySelector('.password-input')
	const signUpButton = document.querySelector('.sign-up-button')
	const isSignedIn = cookie('uid') !== undefined

	if (isSignedIn)
		document.querySelector('.card-content .content').innerHTML = `<h1 class="title">You're already signed in!</h1><button class="button is-medium is-primary sign-out-button">Sign out</button>`

	auth.onAuthStateChanged(user =>
		!isSignedIn && user
			? firestore.doc(`users/${user.uid}`).get().then(doc => {
				if (doc.exists) {
					signUpButton.classList.remove('is-loading')
					alert(`There is already a user with the email ${emailInput.value}`)
				} else {
					firestore.doc(`users/${user.uid}`).set({
						name: nameInput.value,
						email: emailInput.value
					}).then(() => {
						signUpButton.classList.remove('is-loading')
						setCookie('uid', user.uid)
						location.href = '/'
					}).catch(_error => {
						signUpButton.classList.remove('is-loading')
						alert('There was a problem creating an account. Please try again')
					})
				}
			})
			: null
	)

	function inputsAreValid() {
		return nameInput.value.length && emailInput.value.length && passwordInput.value.length
	}

	function reloadSignUpButton() {
		signUpButton.disabled = !inputsAreValid()
	}

	function signUp() {
		if (inputsAreValid()) {
			signUpButton.classList.add('is-loading')
			auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value).catch(_error => {
				signUpButton.classList.remove('is-loading')
				alert('There was a problem creating an account. Please try again')
			})
		} else
			alert('You\'re not allowed to do that!')
	}

	function signOut() {
		
	}

	signUpButton.addEventListener('click', signUp)
	document.querySelectorAll('.sign-out-button').forEach(element => element.addEventListener('click', signOut))
	nameInput.addEventListener('input', reloadSignUpButton)
	emailInput.addEventListener('input', reloadSignUpButton)
	passwordInput.addEventListener('input', reloadSignUpButton)
})