import React, { useContext, useState, useEffect } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import requiresAuth from '../../../hooks/requiresAuth'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'
import useImageUrl from '../../../hooks/useImageUrl'
import LoadingState from '../../../models/LoadingState'
import DeckImageUrlsContext from '../../../contexts/DeckImageUrls'
import { setDeckImageUrl, setDeckImageUrlLoadingState } from '../../../actions'
import PublishDeckContent from '../../shared/PublishDeckContent'
import Button from '../../shared/Button'

import '../../../scss/components/Dashboard/EditDeck.scss'

export default () => {
	requiresAuth()
	
	const { slugId, slug } = useParams()
	const history = useHistory()
	
	const [, dispatchDeckImageUrls] = useContext(DeckImageUrlsContext)
	
	const [currentUser] = useCurrentUser()
	const deck = useDecks().find(deck =>
		deck.slugId === slugId && deck.creatorId === currentUser?.id
	)
	
	const [existingImageUrl, existingImageUrlLoadingState] = useImageUrl(deck)
	const [imageUrl, setImageUrl] = useState(null as string | null)
	
	const [image, setImage] = useState(undefined as File | null | undefined)
	const [name, setName] = useState(deck?.name ?? '')
	const [subtitle, setSubtitle] = useState(deck?.subtitle ?? '')
	const [description, setDescription] = useState(deck?.description ?? '')
	const [topics, setTopics] = useState(deck?.topics ?? [])
	
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const isLoading = loadingState === LoadingState.Loading
	const isDisabled = !name
	
	const closeUrl = `/decks/${slugId ?? ''}/${slug ?? ''}`
	
	useEffect(() => {
		if (!deck)
			return
		
		setName(deck.name)
		setSubtitle(deck.subtitle)
		setDescription(deck.description)
		setTopics(deck.topics)
	}, [deck])
	
	useEffect(() => {
		if (existingImageUrlLoadingState !== LoadingState.Success)
			return
		
		setImageUrl(existingImageUrl)
		setImage(undefined)
	}, [existingImageUrl, existingImageUrlLoadingState])
	
	const edit = async () => {
		if (!(deck && currentUser))
			return
		
		try {
			setLoadingState(LoadingState.Loading)
			
			const deckId = deck.id
			
			const imageUrl = await deck.edit(currentUser.id, {
				image,
				name,
				subtitle,
				description,
				topics
			})
			
			if (imageUrl !== undefined)
				dispatchDeckImageUrls(setDeckImageUrl(
					deckId,
					imageUrl
				))
			
			dispatchDeckImageUrls(setDeckImageUrlLoadingState(
				deckId,
				LoadingState.Success
			))
			
			setLoadingState(LoadingState.Success)
			history.push(closeUrl)
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
				<Link to={closeUrl}>
					<FontAwesomeIcon icon={faTimes} />
				</Link>
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
						imageUrl={imageUrl}
						name={name}
						subtitle={subtitle}
						description={description}
						topics={topics}
						
						setImage={image => {
							setImageUrl(image && URL.createObjectURL(image))
							setImage(image)
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
