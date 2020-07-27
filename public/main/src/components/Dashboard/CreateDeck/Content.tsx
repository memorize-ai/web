import React, { useContext, useRef, useState, memo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import CreateDeckContext from '../../../contexts/CreateDeck'
import useAuthModal from '../../../hooks/useAuthModal'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useTopics from '../../../hooks/useTopics'
import User from '../../../models/User'
import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import {
	setCreateDeckImage,
	setCreateDeckName,
	setCreateDeckSubtitle,
	setCreateDeckDescription,
	setCreateDeckTopics
} from '../../../actions'
import Head from '../../shared/Head'
import PublishDeckContent from '../../shared/PublishDeckContent'
import Button from '../../shared/Button'
import ImportDeckButtons from '../../shared/ImportDeckButtons'
import { compose, handleError } from '../../../utils'

import '../../../scss/components/Dashboard/CreateDeck.scss'

const HEAD_DESCRIPTION = 'Create your own deck on memorize.ai.'

const CreateDeckContent = () => {
	const [
		{ image, name, subtitle, description, topics: selectedTopics },
		dispatch
	] = useContext(CreateDeckContext)
	
	const imageUrl = useRef(null as string | null)
	
	const history = useHistory()
	
	const {
		setIsShowing: setAuthModalIsShowing,
		setCallback: setAuthModalCallback
	} = useAuthModal()
	
	const [currentUser] = useCurrentUser()
	const topics = useTopics()
	
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const isLoading = loadingState === LoadingState.Loading
	const isDisabled = !name
	
	const setImage = useCallback((image: File | null) => {
		imageUrl.current = image && URL.createObjectURL(image)
		dispatch(setCreateDeckImage(image))
	}, [dispatch])
	
	const reset = useCallback(() => {
		dispatch(setCreateDeckImage(null))
		dispatch(setCreateDeckName(''))
		dispatch(setCreateDeckSubtitle(''))
		dispatch(setCreateDeckDescription(''))
		dispatch(setCreateDeckTopics([]))
	}, [dispatch])
	
	const create = useCallback(() => {
		const callback = async (user: User) => {
			try {
				setLoadingState(LoadingState.Loading)
				
				const { slugId, slug } = await Deck.createForUserWithId(user.id, {
					image,
					name,
					subtitle,
					description,
					topics: selectedTopics
				})
				
				setLoadingState(LoadingState.Success)
				reset()
				
				history.push(`/decks/${slugId}/${slug}`)
			} catch (error) {
				setLoadingState(LoadingState.Fail)
				handleError(error)
			}
		}
		
		if (currentUser)
			callback(currentUser)
		else {
			setAuthModalIsShowing(true)
			setAuthModalCallback(callback)
		}
	}, [currentUser, setAuthModalIsShowing, setAuthModalCallback, description, history, image, name, reset, selectedTopics, subtitle])
	
	const setName = useCallback(compose(dispatch, setCreateDeckName), [dispatch])
	const setSubtitle = useCallback(compose(dispatch, setCreateDeckSubtitle), [dispatch])
	const setDescription = useCallback(compose(dispatch, setCreateDeckDescription), [dispatch])
	const setSelectedTopics = useCallback(compose(dispatch, setCreateDeckTopics), [dispatch])
	
	return (
		<>
			<Head
				isPrerenderReady={topics !== null}
				title="Create deck | memorize.ai"
				description={HEAD_DESCRIPTION}
				breadcrumbs={[
					[
						{
							name: 'Market',
							url: 'https://memorize.ai/market'
						},
						{
							name: 'Create deck',
							url: window.location.href
						}
					],
					[
						{
							name: 'Home',
							url: 'https://memorize.ai'
						},
						{
							name: 'Create deck',
							url: window.location.href
						}
					]
				]}
			/>
			<div className="header">
				<h1>Create deck</h1>
				<Button
					loaderSize="20px"
					loaderThickness="4px"
					loaderColor="#582efe"
					loading={isLoading}
					disabled={isDisabled}
					onClick={create}
				>
					Create
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
						selectedTopics={selectedTopics}
						
						setImage={setImage}
						setName={setName}
						setSubtitle={setSubtitle}
						setDescription={setDescription}
						setSelectedTopics={setSelectedTopics}
					>
						<ImportDeckButtons />
					</PublishDeckContent>
				</div>
			</div>
		</>
	)
}

export default memo(CreateDeckContent)
