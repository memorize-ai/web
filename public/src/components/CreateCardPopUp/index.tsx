import React from 'react'
import { useParams } from 'react-router-dom'

import LoadingState from '../../models/LoadingState'
import useCurrentUser from '../../hooks/useCurrentUser'
import Container from './Container'
import Loader from '../shared/Loader'
import Content from './Content'
import Auth from '../shared/Auth'

export default () => {
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	const { deckId, sectionId } = useParams()
	
	return currentUserLoadingState === LoadingState.Loading
		? (
			<Container>
				<Loader
					size="40px"
					thickness="5px"
					color="white"
				/>
			</Container>
		)
		: currentUser
			? (
				<Container>
					<Content
						currentUser={currentUser}
						deckId={deckId}
						sectionId={sectionId}
					/>
				</Container>
			)
			: <Auth title="Create card" />
}
