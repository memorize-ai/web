import React from 'react'
import { useHistory } from 'react-router-dom'

import useQuery from '../../hooks/useQuery'
import Auth from '../shared/Auth'
import { urlWithQuery } from '../../utils'

export const urlForAuth = ({
	title = null as string | null,
	next = null as string | null
} = {}) =>
	urlWithQuery('/auth', {
		title,
		next: next || `${window.location.pathname}${window.location.search}`
	})

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
