import React from 'react'
import ReactDOM from 'react-dom'

import * as serviceWorker from './serviceWorker'
import App from './components/App'

import 'react-bulma-components/dist/react-bulma-components.min.css'

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.register()
