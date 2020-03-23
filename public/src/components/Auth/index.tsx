import React from 'react'
import { useHistory } from 'react-router-dom'

import useQuery from '../../hooks/useQuery'
import Auth from '../shared/Auth'

export default () => {
	const history = useHistory()
	const next = useQuery().get('next') ?? '/'
	
	return (
		<Auth
			title="Welcome to memorize.ai!"
			onUser={() => history.push(next)}
		/>
	)
}
