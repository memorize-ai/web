import React, { useEffect, useCallback, useMemo, memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Topic from '../../models/Topic'
import ImagePicker from './ImagePicker'

import '../../scss/components/PublishDeckContent.scss'

export interface PublishDeckContentProps {
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
	
	const onNameInputRef = useCallback((input: HTMLInputElement | null) => {
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
				url={imageUrl}
				removeImage={removeImage}
			/>
			<div className="right">
				<div className="inputs">
					<label htmlFor="publish-deck-name-input">
						Name <span>(SAT Math Prep)</span>
					</label>
					<input
						ref={onNameInputRef}
						id="publish-deck-name-input"
						placeholder="A good name shows your deck to more people"
						value={name}
						onChange={({ target: { value } }) => setName(value)}
					/>
					<label htmlFor="publish-deck-subtitle-input">
						Subtitle <span>(Trusted by over 1,000 memorize.ai users)</span>
					</label>
					<input
						id="publish-deck-subtitle-input"
						placeholder="Optional, but subtitles make your deck stand out"
						value={subtitle}
						onChange={({ target: { value } }) => setSubtitle(value)}
					/>
					<label htmlFor="publish-deck-description-textarea">
						Description
					</label>
					<textarea
						id="publish-deck-description-textarea"
						placeholder="Optional, but good descriptions often convince users to get your deck"
						value={description}
						onChange={({ target: { value } }) => setDescription(value)}
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
