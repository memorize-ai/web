document.addEventListener('DOMContentLoaded', () => {
	firebase.initializeApp({
		apiKey: 'AIzaSyDfSkXDJ4kQCrRGfyauprPKPPoGZFEhySU',
		authDomain: 'memorize-ai.firebaseapp.com',
		databaseURL: 'https://memorize-ai.firebaseio.com',
		projectId: 'memorize-ai',
		storageBucket: 'memorize-ai.appspot.com',
		messagingSenderId: '629763488334',
		appId: '1:629763488334:web:9199305a713b3634'
	})

	const functions = firebase.functions()
	let accept

	switch (new URLSearchParams(location.search).get('accept')) {
	case 'true':
		showConfirmModal(true)
	case 'false':
		showConfirmModal(false)
	}

	function showConfirmModal(accept_) {
		accept = accept_

	}

	function confirmInvite() {
		functions.httpsCallable('confirmInvite')().then(() => {
			stopLoading()
			hideConfirmModal()
		}).catch(() => {
			stopLoading()
			alert('An unknown error ocurred. Reload the page and try again')
		})
	}

	function stopLoading() {
		document.querySelector('.modal .button.confirm').classList.remove('is-loading')
	}

	document.querySelector('').addEventListener('click', confirmInvite)
	document.querySelector('.modal .button.confirm').addEventListener('click', confirmInvite)
})