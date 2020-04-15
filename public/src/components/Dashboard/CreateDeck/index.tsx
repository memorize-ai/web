import React, { useContext, useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignature, faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import CreateDeckContext from '../../../contexts/CreateDeck'
import useAuthModal from '../../../hooks/useAuthModal'
import useAuthState from '../../../hooks/useAuthState'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useTopics from '../../../hooks/useTopics'
import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import {
	setCreateDeckImage,
	setCreateDeckName,
	setCreateDeckSubtitle,
	setCreateDeckDescription,
	setCreateDeckTopics
} from '../../../actions'
import ImagePicker from '../../shared/ImagePicker'
import Input from '../../shared/Input'
import TextArea from '../../shared/TextArea'
import Button from '../../shared/Button'
import { compose } from '../../../utils'

import '../../../scss/components/Dashboard/CreateDeck.scss'

export default () => {
	const [
		{ image, name, subtitle, description, topics: selectedTopics },
		dispatch
	] = useContext(CreateDeckContext)
	
	const history = useHistory()
	
	const isSignedIn = useAuthState()
	const [[, setAuthModalIsShowing], [, setAuthModalCallback]] = useAuthModal()
	
	const [currentUser] = useCurrentUser()
	const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone()
	
	const [imageUrl, setImageUrl] = useState(null as string | null)
	const [createLoadingState, setCreateLoadingState] = useState(LoadingState.None)
	
	const isCreateButtonLoading = createLoadingState === LoadingState.Loading
	const isCreateButtonDisabled = !name
	
	useEffect(() => {
		if (acceptedFiles.length)
			dispatch(setCreateDeckImage(acceptedFiles[0]))
	}, [acceptedFiles]) // eslint-disable-line
	
	useEffect(() => {
		setImageUrl(image && URL.createObjectURL(image))
	}, [image])
	
	const focusNameInput = useCallback((input: HTMLInputElement | null) => {
		input?.focus()
	}, [])
	
	const reset = () => {
		dispatch(setCreateDeckImage(null))
		dispatch(setCreateDeckName(''))
		dispatch(setCreateDeckSubtitle(''))
		dispatch(setCreateDeckDescription(''))
		dispatch(setCreateDeckTopics([]))
	}
	
	const create = async () => {
		if (!currentUser) {
			setAuthModalIsShowing(true)
			setAuthModalCallback(create)
			
			return
		}
		
		try {
			setCreateLoadingState(LoadingState.Loading)
			
			const slug = await Deck.createForUserWithId(currentUser.id, {
				image,
				name,
				subtitle,
				description,
				topics: selectedTopics
			})
			
			setCreateLoadingState(LoadingState.Success)
			reset()
			
			history.push(`/decks/${slug}`)
		} catch (error) {
			setCreateLoadingState(LoadingState.Fail)
			
			console.error(error)
			alert(error.message)
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
					loading={isCreateButtonLoading}
					disabled={isCreateButtonDisabled}
					onClick={create}
				>
					Create
				</Button>
			</div>
			<div className="content">
				<div className="box">
					<ImagePicker
						rootProps={getRootProps()}
						inputProps={getInputProps()}
						isDragging={isDragActive}
						url={imageUrl}
						removeImage={() => setImageUrl(null)}
					/>
					<div className="right">
						<div className="inputs">
							<label>Name (eg. SAT Math Prep)</label>
							<Input
								ref={focusNameInput}
								icon={faSignature}
								type="name"
								placeholder="Required"
								value={name}
								setValue={compose(dispatch, setCreateDeckName)}
							/>
							<label>Subtitle (eg. The best way to study for the SAT)</label>
							<Input
								icon={faSignature}
								type="name"
								placeholder="Optional"
								value={subtitle}
								setValue={compose(dispatch, setCreateDeckSubtitle)}
							/>
							<label>Description</label>
							<TextArea
								minHeight={100}
								placeholder="Optional"
								value={description}
								setValue={compose(dispatch, setCreateDeckDescription)}
							/>
						</div>
						{selectedTopics.length === 0 && (
							<p className="no-topics-message">
								You must select relevant topics for your deck to be recommended
							</p>
						)}
						<div className="topics">
							{useTopics().map(topic => {
								const isSelected = selectedTopics.includes(topic.id)
								
								return (
									<button
										key={topic.id}
										className={cx({ selected: isSelected })}
										onClick={() =>
											dispatch(setCreateDeckTopics(
												isSelected
													? selectedTopics.filter(topicId => topicId !== topic.id)
													: [...selectedTopics, topic.id]
											))
										}
										style={{
											backgroundImage: `linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8)), url('${topic.imageUrl}')`
										}}
									>
										<div className="check">
											<FontAwesomeIcon icon={faCheck} />
										</div>
										<p>{topic.name}</p>
									</button>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</Dashboard>
	)
}
