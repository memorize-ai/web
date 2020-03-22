import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import AOS from 'aos'

import * as serviceWorker from './serviceWorker'
import { DecksProvider } from './contexts/Decks'
import App from './components/App'
import firebase from './firebase'

import 'firebase/analytics'

import './scss/index.scss'

const analytics = firebase.analytics()

analytics.logEvent('start')
AOS.init()

Modal.setAppElement(document.getElementById('root')!)

ReactDOM.render((
	<DecksProvider>
		<App />
	</DecksProvider>
), document.getElementById('root'))

serviceWorker.register()
