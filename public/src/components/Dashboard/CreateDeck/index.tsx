import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignature, faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import CreateDeckContext from '../../../contexts/CreateDeck'
import useQuery from '../../../hooks/useQuery'
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
import BackButton from '../../shared/BackButton'
import ImagePicker from '../../shared/ImagePicker'
import Input from '../../shared/Input'
import TextArea from '../../shared/TextArea'
import Button from '../../shared/Button'
import { urlForAuth } from '../../Auth'
import { urlWithQuery, compose } from '../../../utils'

import '../../../scss/components/Dashboard/CreateDeck.scss'

export default () => {
	const [
		{ image, name, subtitle, description, topics: selectedTopics },
		dispatch
	] = useContext(CreateDeckContext)
	
	const history = useHistory()
	const shouldCreate = useQuery().get('action') === 'create'
	
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
	
	useEffect(() => {
		if (shouldCreate && name)
			create()
	}, [shouldCreate]) // eslint-disable-line
	
	const reset = () => {
		dispatch(setCreateDeckImage(null))
		dispatch(setCreateDeckName(''))
		dispatch(setCreateDeckSubtitle(''))
		dispatch(setCreateDeckDescription(''))
		dispatch(setCreateDeckTopics([]))
	}
	
	const create = async () => {
		if (!currentUser)
			return history.push(urlForAuth({
				title: 'Before you create your deck...',
				next: urlWithQuery('/new', { action: 'create' })
			}))
		
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
		<Dashboard selection={Selection.Home} className="create-deck" gradientHeight="500px">
			<div className="header">
				<BackButton to="/" />
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
				<div>
					<ImagePicker
						rootProps={getRootProps()}
						inputProps={getInputProps()}
						isDragging={isDragActive}
						url={imageUrl}
						removeImage={() => setImageUrl(null)}
					/>
					<div className="inputs">
						<Input
							icon={faSignature}
							type="name"
							placeholder="Name (required)"
							value={name}
							setValue={compose(dispatch, setCreateDeckName)}
						/>
						<Input
							icon={faSignature}
							type="name"
							placeholder="Subtitle (optional)"
							value={subtitle}
							setValue={compose(dispatch, setCreateDeckSubtitle)}
						/>
						<TextArea
							minHeight={100}
							placeholder="Description (optional)"
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
		</Dashboard>
	)
}
