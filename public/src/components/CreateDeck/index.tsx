import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { faSignature } from '@fortawesome/free-solid-svg-icons'

import CreateDeckContext from '../../contexts/CreateDeck'
import useQuery from '../../hooks/useQuery'
import useCurrentUser from '../../hooks/useCurrentUser'
import Deck from '../../models/Deck'
import LoadingState from '../../models/LoadingState'
import {
	setCreateDeckImage,
	setCreateDeckName,
	setCreateDeckSubtitle,
	setCreateDeckDescription
} from '../../actions'
import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import ImagePicker from '../shared/ImagePicker'
import Input from '../shared/Input'
import TextArea from '../shared/TextArea'
import Button from '../shared/Button'
import { urlWithQuery, compose1 } from '../../utils'

import '../../scss/components/CreateDeck.scss'

export default () => {
	const [{ image, name, subtitle, description }, dispatch] = useContext(CreateDeckContext)
	const history = useHistory()
	const shouldCreate = useQuery().get('action') === 'create'
	
	const [currentUser] = useCurrentUser()
	const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone()
	
	const [imageUrl, setImageUrl] = useState(null as string | null)
	const [createLoadingState, setCreateLoadingState] = useState(LoadingState.None)
	
	const isCreateButtonLoading = createLoadingState === LoadingState.Loading
	const isCreateButtonDisabled = !name
	
	useEffect(() => {
		if (shouldCreate)
			return
		
		dispatch(setCreateDeckImage(
			acceptedFiles.length ? acceptedFiles[0] : null
		))
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
	}
	
	const create = async () => {
		if (!currentUser)
			return history.push(urlWithQuery('/auth', {
				title: 'Before you create your deck...',
				next: urlWithQuery('/new', { action: 'create' })
			}))
		
		try {
			setCreateLoadingState(LoadingState.Loading)
			
			const deckId = await Deck.createForUserWithId(
				currentUser.id,
				{ image, name, subtitle, description }
			)
			
			setCreateLoadingState(LoadingState.Success)
			
			reset()
			history.push(`/decks/${deckId}`)
		} catch (error) {
			setCreateLoadingState(LoadingState.Fail)
			
			console.error(error)
			alert(error.message)
		}
	}
	
	return (
		<div className="create-deck">
			<TopGradient>
				<Navbar />
				<div className="main-box">
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
							setValue={compose1(dispatch, setCreateDeckName)}
						/>
						<Input
							icon={faSignature}
							type="name"
							placeholder="Subtitle (optional)"
							value={subtitle}
							setValue={compose1(dispatch, setCreateDeckSubtitle)}
						/>
						<TextArea
							minHeight={100}
							placeholder="Description"
							value={description}
							setValue={compose1(dispatch, setCreateDeckDescription)}
						/>
					</div>
					<Button
						loaderSize="16px"
						loaderThickness="3px"
						loaderColor="#63b3ed"
						loading={isCreateButtonLoading}
						disabled={isCreateButtonDisabled}
						onClick={create}
					>
						Create
					</Button>
				</div>
			</TopGradient>
		</div>
	)
}
