import React from 'react'
import ReactDOM from 'react-dom'
import AOS from 'aos'

import * as serviceWorker from './serviceWorker'
import App from './components/App'
import firebase from './firebase'

import 'firebase/analytics'

const analytics = firebase.analytics()

analytics.logEvent('start')
AOS.init()

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.register()
