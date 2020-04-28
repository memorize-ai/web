import React, { useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignature, faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import useTopics from '../../hooks/useTopics'
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
	topics: string[]
	
	setImage: (image: File | null) => void
	setName: (name: string) => void
	setSubtitle: (subtitle: string) => void
	setDescription: (description: string) => void
	setTopics: (topics: string[]) => void
}

export default ({
	isImageLoading = false,
	imageUrl,
	name,
	subtitle,
	description,
	topics,
	
	setImage,
	setName,
	setSubtitle,
	setDescription,
	setTopics
}: PublishDeckContentProps) => {
	const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone()
	
	useEffect(() => {
		if (acceptedFiles.length)
			setImage(acceptedFiles[0])
	}, [acceptedFiles]) // eslint-disable-line
	
	const focusNameInput = useCallback((input: HTMLInputElement | null) => {
		input?.focus()
	}, [])
	
	return (
		<div className="publish-deck-content">
			<ImagePicker
				rootProps={getRootProps()}
				inputProps={getInputProps()}
				isDragging={isDragActive}
				isLoading={isImageLoading}
				url={imageUrl}
				removeImage={() => setImage(null)}
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
				{topics.length === 0 && (
					<p className="no-topics-message">
						You must select relevant topics for your deck to be recommended
					</p>
				)}
				<div className="topics">
					{useTopics().map(topic => {
						const isSelected = topics.includes(topic.id)
						
						return (
							<button
								key={topic.id}
								className={cx({ selected: isSelected })}
								onClick={() =>
									setTopics(
										isSelected
											? topics.filter(topicId => topicId !== topic.id)
											: [...topics, topic.id]
									)
								}
								style={{
									backgroundImage: `url('${topic.imageUrl}')`
								}}
								{...topic.schemaProps}
							>
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
