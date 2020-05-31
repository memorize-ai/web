import React, { useEffect, useCallback, useMemo, memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignature, faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Topic from '../../models/Topic'
import ImagePicker from './ImagePicker'
import Input from './Input'
import TextArea from './TextArea'

import '../../scss/components/PublishDeckContent.scss'

export interface PublishDeckContentProps {
	isImageLoading?: boolean
	imageUrl: string | null
	name: string
	subtitle: string
	description: string
	topics: Topic[] | null
	selectedTopics: string[]
	
	setImage: (image: File | null) => void
	setName: (name: string) => void
	setSubtitle: (subtitle: string) => void
	setDescription: (description: string) => void
	setSelectedTopics: (topics: string[]) => void
}

const PublishDeckContent = ({
	isImageLoading = false,
	imageUrl,
	name,
	subtitle,
	description,
	topics,
	selectedTopics,
	
	setImage,
	setName,
	setSubtitle,
	setDescription,
	setSelectedTopics
}: PublishDeckContentProps) => {
	const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone()
	
	const rootProps = useMemo(getRootProps, [getRootProps])
	const inputProps = useMemo(getInputProps, [getInputProps])
	
	useEffect(() => {
		if (acceptedFiles.length)
			setImage(acceptedFiles[0])
	}, [acceptedFiles, setImage])
	
	const focusNameInput = useCallback((input: HTMLInputElement | null) => {
		input?.focus()
	}, [])
	
	const removeImage = useCallback(() => {
		setImage(null)
	}, [setImage])
	
	return (
		<div className="publish-deck-content">
			<ImagePicker
				rootProps={rootProps}
				inputProps={inputProps}
				isDragging={isDragActive}
				isLoading={isImageLoading}
				url={imageUrl}
				removeImage={removeImage}
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
						setValue={setName}
					/>
					<label>Subtitle (eg. The best way to study for the SAT)</label>
					<Input
						icon={faSignature}
						type="name"
						placeholder="Optional"
						value={subtitle}
						setValue={setSubtitle}
					/>
					<label>Description</label>
					<TextArea
						minHeight={100}
						placeholder="Optional"
						value={description}
						setValue={setDescription}
					/>
				</div>
				{selectedTopics.length === 0 && (
					<p className="no-topics-message">
						You must select relevant topics for your deck to be recommended
					</p>
				)}
				<div className="topics" {...Topic.schemaProps}>
					{topics?.map((topic, i) => {
						const isSelected = selectedTopics.includes(topic.id)
						
						return (
							<button
								key={topic.id}
								className={cx({ selected: isSelected })}
								onClick={() =>
									setSelectedTopics(
										isSelected
											? selectedTopics.filter(topicId => topicId !== topic.id)
											: [...selectedTopics, topic.id]
									)
								}
								style={{
									backgroundImage: `url('${topic.imageUrl}')`
								}}
								{...topic.schemaProps}
							>
								<meta {...topic.positionSchemaProps(i)} />
								<meta {...topic.urlSchemaProps} />
								<img {...topic.imageSchemaProps} /* eslint-disable-line */ />
								<div className="check">
									<FontAwesomeIcon icon={faCheck} />
								</div>
								<p {...topic.nameSchemaProps}>{topic.name}</p>
							</button>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default memo(PublishDeckContent)
