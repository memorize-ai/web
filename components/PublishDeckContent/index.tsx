import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Topic from 'models/Topic'
import ImagePicker from '../ImagePicker'

import styles from './index.module.scss'

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
	const onDrop = useCallback(
		(files: File[]) => {
			const file = files[0]
			if (file) setImage(file)
		},
		[setImage]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		multiple: false,
		accept: ['image/png', 'image/jpeg', 'image/webp'],
		onDrop
	})

	const onNameInputRef = useCallback((input: HTMLInputElement | null) => {
		input?.focus()
	}, [])

	const removeImage = useCallback(() => {
		setImage(null)
	}, [setImage])

	return (
		<div className={styles.root}>
			<ImagePicker
				className={styles.image}
				rootProps={getRootProps()}
				inputProps={getInputProps()}
				isDragging={isDragActive}
				url={imageUrl}
				removeImage={removeImage}
			/>
			<article className={styles.content}>
				<div className={styles.inputs}>
					<label className={styles.label} htmlFor="publish-deck-name-input">
						Name <span className={styles.example}>(SAT Math Prep)</span>
					</label>
					<input
						ref={onNameInputRef}
						id="publish-deck-name-input"
						className={styles.input}
						placeholder="A good name shows your deck to more people"
						value={name}
						onChange={({ target: { value } }) => setName(value)}
					/>
					<label className={styles.label} htmlFor="publish-deck-subtitle-input">
						Subtitle{' '}
						<span className={styles.example}>
							(Trusted by over 1,000 memorize.ai users)
						</span>
					</label>
					<input
						id="publish-deck-subtitle-input"
						className={styles.input}
						placeholder="Optional, but subtitles make your deck stand out"
						value={subtitle}
						onChange={({ target: { value } }) => setSubtitle(value)}
					/>
					<label
						className={styles.label}
						htmlFor="publish-deck-description-textarea"
					>
						Description
					</label>
					<textarea
						id="publish-deck-description-textarea"
						className={styles.textArea}
						placeholder="Optional, but add keywords to help expose your deck in search results"
						value={description}
						onChange={({ target: { value } }) => setDescription(value)}
					/>
				</div>
				<p className={styles.noTopics} hidden={selectedTopics.length > 0}>
					You must select relevant topics for your deck to be recommended
				</p>
				<div className={styles.topics} {...Topic.schemaProps}>
					{topics?.map((topic, i) => {
						const isSelected = selectedTopics.includes(topic.id)

						return (
							<button
								key={topic.id}
								className={cx(styles.topic, {
									[styles.selectedTopic]: isSelected
								})}
								onClick={() =>
									setSelectedTopics(
										isSelected
											? selectedTopics.filter(topicId => topicId !== topic.id)
											: [...selectedTopics, topic.id]
									)
								}
								style={{ backgroundImage: topic.backgroundImage }}
								{...topic.schemaProps}
							>
								<meta {...topic.positionSchemaProps(i)} />
								<meta {...topic.urlSchemaProps} />
								<img {...topic.imageSchemaProps} />
								<div className={styles.topicCheck}>
									<FontAwesomeIcon
										className={styles.topicCheckIcon}
										icon={faCheck}
									/>
								</div>
								<p className={styles.topicName} {...topic.nameSchemaProps}>
									{topic.name}
								</p>
							</button>
						)
					})}
				</div>
			</article>
		</div>
	)
}

export default PublishDeckContent
