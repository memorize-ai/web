import React from 'react'
import { useHistory } from 'react-router-dom'

import useQuery from '../../hooks/useQuery'
import Auth from '../shared/Auth'

export default () => {
	const history = useHistory()
	const query = useQuery()
	
	return (
		<Auth
			title={query.get('title') ?? 'Welcome to memorize.ai!'}
			onUser={() => history.push(query.get('next') ?? '/')}
		/>
	)
}
