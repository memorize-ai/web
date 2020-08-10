import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import requiresAuth from '../../../hooks/requiresAuth'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useCreatedDeck from '../../../hooks/useCreatedDeck'
import useTopics from '../../../hooks/useTopics'
import LoadingState from '../../../models/LoadingState'
import Head from '../../shared/Head'
import Button from '../../shared/Button'
import PublishDeckContent from '../../shared/PublishDeckContent'
import Loader from '../../shared/Loader'
import { handleError } from '../../../utils'

import '../../../scss/components/Dashboard/EditDeck.scss'

const EditDeckContent = () => {
	requiresAuth()
	
	const didUpdateFromDeck = useRef(false)
	
	const { slugId, slug } = useParams()
	const history = useHistory()
	
	const [currentUser] = useCurrentUser()
	const deck = useCreatedDeck(slugId, slug)
	const topics = useTopics()
	
	const [imageUrl, setImageUrl] = useState(null as string | null)
	const [image, setImage] = useState(undefined as File | null | undefined)
	const [name, setName] = useState(deck?.name ?? '')
	const [subtitle, setSubtitle] = useState(deck?.subtitle ?? '')
	const [description, setDescription] = useState(deck?.description ?? '')
	const [selectedTopics, setSelectedTopics] = useState(deck?.topics ?? [])
	
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const isLoading = loadingState === LoadingState.Loading
	const isDisabled = !name
	
	const closeUrl = `/decks/${slugId ?? ''}/${slug ?? ''}`
	const headDescription = `Edit ${deck?.name ?? 'your deck'} on memorize.ai.`
	
	useEffect(() => {
		if (!deck || didUpdateFromDeck.current)
			return
		
		didUpdateFromDeck.current = true
		
		setImageUrl(deck.imageUrl)
		setName(deck.name)
		setSubtitle(deck.subtitle)
		setDescription(deck.description)
		setSelectedTopics(deck.topics)
	}, [deck])
	
	const edit = useCallback(async () => {
		if (!(deck && currentUser))
			return
		
		try {
			setLoadingState(LoadingState.Loading)
			
			await deck.edit(currentUser.id, {
				image,
				name,
				subtitle,
				description,
				topics: selectedTopics
			})
			
			setLoadingState(LoadingState.Success)
			history.push(closeUrl)
		} catch (error) {
			setLoadingState(LoadingState.Fail)
			handleError(error)
		}
	}, [deck, currentUser, setLoadingState, history, closeUrl, description, image, name, selectedTopics, subtitle])
	
	const setImageAndUrl = useCallback((image: File | null) => {
		setImageUrl(image && URL.createObjectURL(image))
		setImage(image)
	}, [setImageUrl, setImage])
	
	return (
		<>
			<Head
				title={`Edit ${deck?.name ?? 'deck'} | memorize.ai`}
				description={headDescription}
				breadcrumbs={[
					[
						{
							name: 'Decks',
							url: 'https://memorize.ai/decks'
						},
						{
							name: deck?.name ?? 'Deck',
							url: `https://memorize.ai/decks/${deck?.slugId ?? '...'}/${deck?.slug ?? '...'}`
						},
						{
							name: 'Edit',
							url: window.location.href
						}
					]
				]}
			/>
			<div className="header">
				<Link to={closeUrl} className="close">
					<FontAwesomeIcon icon={faTimes} />
				</Link>
				<h1>Edit <span>{deck?.name ?? 'deck'}</span></h1>
				<Button
					loaderSize="20px"
					loaderThickness="4px"
					loaderColor="#582efe"
					loading={isLoading}
					disabled={isDisabled}
					onClick={edit}
				>
					Save
				</Button>
			</div>
			<div className="content">
				<div className={cx('box', { loading: !deck })}>
					{deck
						? (
							<PublishDeckContent
								imageUrl={imageUrl}
								name={name}
								subtitle={subtitle}
								description={description}
								topics={topics}
								selectedTopics={selectedTopics}
								
								setImage={setImageAndUrl}
								setName={setName}
								setSubtitle={setSubtitle}
								setDescription={setDescription}
								setSelectedTopics={setSelectedTopics}
							/>
						)
						: <Loader size="24px" thickness="4px" color="#582efe" />
					}
				</div>
			</div>
		</>
	)
}

export default EditDeckContent
