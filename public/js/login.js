document.addEventListener('DOMContentLoaded', function() {
	const from = urlParam('f') || 'dashboard'
	const signingUp = urlParamExists('sign_up')
	const app = Elm.Page.Login.init({flags: {from, signingUp}})
	// const updateNameFromCredential = app => displayName => userCredential =>
	// 	userCredential.user.updateProfile({ displayName })
	// 		.then(() => app.ports.userUpdated.send(userCredential.user))
	const createUserNode = account => userCredential =>
		firebase.firestore().collection('users').doc(userCredential.user.uid).set({
			name: account.displayName,
			email: account.email
		}).then(() => app.ports.userUpdated.send(userCredential.user))
	const sendAppInvalidSignUpMessage = app => error =>
		error && app.ports.invalidSignUp.send(error.message)
	const sendAppInvalidSignInMessage = app => error =>
		error && app.ports.invalidSignIn.send(error.message)
	const redirectToFrom = () =>
		window.location.href = from

	firebase.auth().onAuthStateChanged(user =>
		user
			? app.ports.userUpdated.send(user)
			: app.ports.signedOut.send(null)
	)
	app.ports.signUp.subscribe(account =>
		firebase.auth().createUserWithEmailAndPassword(account.email, account.password)
			.then(createUserNode(account))
			// .then(updateNameFromCredential(app)(account.displayName))
			.then(redirectToFrom)
			.catch(sendAppInvalidSignUpMessage(app))
	)
	app.ports.signIn.subscribe(login =>
		firebase.auth().signInWithEmailAndPassword(login.email, login.password)
			.then(redirectToFrom)
			.catch(sendAppInvalidSignInMessage(app))
	)
	listenSignOut(app)
})