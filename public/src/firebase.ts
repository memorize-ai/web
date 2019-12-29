import firebase from 'firebase/app'

import { DEBUG } from './constants'

firebase.initializeApp(
	DEBUG
		? {
			apiKey: 'AIzaSyBmq8gR9cJgiEdpIsBkr9hP_cg8kWzovYA',
			authDomain: 'memorize-ai-dev.firebaseapp.com',
			databaseURL: 'https://memorize-ai-dev.firebaseio.com',
			projectId: 'memorize-ai-dev',
			storageBucket: 'memorize-ai-dev.appspot.com',
			messagingSenderId: '282248067698',
			appId: '1:282248067698:web:15118a7de810d7b23860eb'
		}
		: {
			apiKey: 'AIzaSyDfSkXDJ4kQCrRGfyauprPKPPoGZFEhySU',
			authDomain: 'memorize-ai.firebaseapp.com',
			databaseURL: 'https://memorize-ai.firebaseio.com',
			projectId: 'memorize-ai',
			storageBucket: 'memorize-ai.appspot.com',
			messagingSenderId: '629763488334',
			appId: '1:629763488334:web:9199305a713b3634'
		}
)

export default firebase
