import firebase from 'firebase/app'

if (!firebase.apps.length)
	firebase.initializeApp({
		apiKey: 'AIzaSyDfSkXDJ4kQCrRGfyauprPKPPoGZFEhySU',
		authDomain: 'memorize-ai.firebaseapp.com',
		databaseURL: 'https://memorize-ai.firebaseio.com',
		projectId: 'memorize-ai',
		storageBucket: 'memorize-ai.appspot.com',
		messagingSenderId: '629763488334',
		appId: '1:629763488334:web:9199305a713b3634',
		measurementId: 'G-N98QHH5MJ8'
	})

export default firebase
