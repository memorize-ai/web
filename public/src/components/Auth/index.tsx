import React from 'react'
import { useHistory } from 'react-router-dom'

import Auth from '../shared/Auth'

export default () => {
	const history = useHistory()
	
	return (
		<Auth
			title="Welcome to memorize.ai!"
			onUser={() => history.push('/')}
		/>
	)
}
