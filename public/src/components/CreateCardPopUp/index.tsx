import React, { useState } from 'react'

import useQuery from '../../hooks/useQuery'
import useCurrentUser from '../../hooks/useCurrentUser'

export default () => {
	const text = useQuery().get('text') ?? ''
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	const [decks, setDecks] = useState([] as { name: string }[])
	
	return (
		<div>{text}<script>const a = 4; console.log(a)</script></div>
	)
}
