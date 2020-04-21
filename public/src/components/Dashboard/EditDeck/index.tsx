import React, { useRef, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import requiresAuth from '../../../hooks/requiresAuth'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useImageUrl from '../../../hooks/useImageUrl'
import LoadingState from '../../../models/LoadingState'
import PublishDeckContent from '../../shared/PublishDeckContent'
import Button from '../../shared/Button'

import '../../../scss/components/Dashboard/EditDeck.scss'
import useDecks from '../../../hooks/useDecks'

export default () => {
	requiresAuth()
	
	const { slugId, slug } = useParams()
	
	const imageUrl = useRef(null as string | null)
	
	const history = useHistory()
	
	const [currentUser] = useCurrentUser()
	const deck = useDecks().find(deck =>
		deck.slugId === slugId && deck.creatorId === currentUser?.id
	)
	
	const [didChangeImage, setDidChangeImage] = useState(false)
	
	const [image, setImage] = useState(null as File | null)
	const [name, setName] = useState(deck?.name ?? '')
	const [subtitle, setSubtitle] = useState(deck?.subtitle ?? '')
	const [description, setDescription] = useState(deck?.description ?? '')
	const [topics, setTopics] = useState(deck?.topics ?? [])
	
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const isLoading = loadingState === LoadingState.Loading
	const isDisabled = !name
	
	const close = () =>
		history.push(`/decks/${slugId}/${slug}`)
	
	const edit = async () => {
		if (!(deck && currentUser))
			return
		
		try {
			setLoadingState(LoadingState.Loading)
			
			await deck.edit(currentUser.id, {
				image: didChangeImage ? image : undefined,
				name,
				subtitle,
				description,
				topics
			})
			
			setLoadingState(LoadingState.Success)
			close()
		} catch (error) {
			setLoadingState(LoadingState.Fail)
			
			console.error(error)
			alert(error.message)
		}
	}
	
	return (
		<Dashboard
			selection={Selection.Decks}
			className="edit-deck"
			gradientHeight="500px"
		>
			<div className="header">
				<h1>Edit <span>{deck?.name ?? 'deck'}</span></h1>
				<Button
					loaderSize="16px"
					loaderThickness="3px"
					loaderColor="#582efe"
					loading={isLoading}
					disabled={isDisabled}
					onClick={edit}
				>
					Save
				</Button>
			</div>
			<div className="content">
				<div className="box">
					<PublishDeckContent
						imageUrl={imageUrl.current}
						name={name}
						subtitle={subtitle}
						description={description}
						topics={topics}
						
						setImage={image => {
							imageUrl.current = image && URL.createObjectURL(image)
							
							setImage(image)
							setDidChangeImage(true)
						}}
						setName={setName}
						setSubtitle={setSubtitle}
						setDescription={setDescription}
						setTopics={setTopics}
					/>
				</div>
			</div>
		</Dashboard>
	)
}
