import React, { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import CreateDeckContext from '../../../contexts/CreateDeck'
import useAuthModal from '../../../hooks/useAuthModal'
import useAuthState from '../../../hooks/useAuthState'
import useCurrentUser from '../../../hooks/useCurrentUser'
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
import PublishDeckContent from '../../shared/PublishDeckContent'
import Button from '../../shared/Button'
import { compose } from '../../../utils'

import '../../../scss/components/Dashboard/CreateDeck.scss'

export default () => {
	const [
		{ image, name, subtitle, description, topics: selectedTopics },
		dispatch
	] = useContext(CreateDeckContext)
	
	const imageUrl = useRef(null as string | null)
	
	const history = useHistory()
	
	const isSignedIn = useAuthState()
	const [[, setAuthModalIsShowing], [, setAuthModalCallback]] = useAuthModal()
	
	const [currentUser] = useCurrentUser()
	
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const isLoading = loadingState === LoadingState.Loading
	const isDisabled = !name
	
	const reset = () => {
		dispatch(setCreateDeckImage(null))
		dispatch(setCreateDeckName(''))
		dispatch(setCreateDeckSubtitle(''))
		dispatch(setCreateDeckDescription(''))
		dispatch(setCreateDeckTopics([]))
	}
	
	const create = () => {
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
				
				console.error(error)
				alert(error.message)
			}
		}
		
		if (currentUser)
			callback(currentUser)
		else {
			setAuthModalIsShowing(true)
			setAuthModalCallback(callback)
		}
	}
	
	return (
		<Dashboard
			selection={isSignedIn ? Selection.Home : Selection.Market}
			className="create-deck"
			gradientHeight="500px"
		>
			<div className="header">
				<h1>Create deck</h1>
				<Button
					loaderSize="16px"
					loaderThickness="3px"
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
						topics={selectedTopics}
						
						setImage={image => {
							imageUrl.current = image && URL.createObjectURL(image)
							dispatch(setCreateDeckImage(image))
						}}
						setName={compose(dispatch, setCreateDeckName)}
						setSubtitle={compose(dispatch, setCreateDeckSubtitle)}
						setDescription={compose(dispatch, setCreateDeckDescription)}
						setTopics={compose(dispatch, setCreateDeckTopics)}
					/>
				</div>
			</div>
		</Dashboard>
	)
}
