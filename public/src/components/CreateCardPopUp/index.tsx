import React from 'react'
import { useParams } from 'react-router-dom'

import LoadingState from '../../models/LoadingState'
import useCurrentUser from '../../hooks/useCurrentUser'
import Container from './Container'
import Loader from '../shared/Loader'
import Content from './Content'
import Authenticate from './Authenticate'

export default () => {
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	const { deckId, sectionId } = useParams()
	
	return (
		<Container>
			{currentUserLoadingState === LoadingState.Loading
				? (
					<Loader
						size="40px"
						thickness="5px"
						color="white"
					/>
				)
				: currentUser
					? (
						<Content
							currentUser={currentUser}
							deckId={deckId}
							sectionId={sectionId}
						/>
					)
					: <Authenticate />
			}
		</Container>
	)
}
