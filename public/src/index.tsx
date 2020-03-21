import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import AOS from 'aos'

import * as serviceWorker from './serviceWorker'
import reducers from './reducers'
import App from './components/App'
import firebase from './firebase'

import 'firebase/analytics'

import './scss/index.scss'

const analytics = firebase.analytics()
const enhancer = (
	(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose
)(applyMiddleware(reduxThunk))

analytics.logEvent('start')
AOS.init()

Modal.setAppElement(document.getElementById('root')!)

ReactDOM.render((
	<Provider store={createStore(reducers, enhancer)}>
		<App />
	</Provider>
), document.getElementById('root'))

serviceWorker.register()
