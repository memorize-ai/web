import { useState, useEffect, useRef, useCallback } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { EditDeckQuery } from './models'
import LoadingState from 'models/LoadingState'
import handleError from 'lib/handleError'
import requiresAuth from 'hooks/requiresAuth'
import useCurrentUser from 'hooks/useCurrentUser'
import useCreatedDeck from 'hooks/useCreatedDeck'
import useTopics from 'hooks/useTopics'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head from 'components/Head'
import Button from 'components/Button'
import PublishDeckContent from 'components/PublishDeckContent'
import Loader from 'components/Loader'

import styles from './index.module.scss'

const EditDeck: NextPage = () => {
	requiresAuth()

	const didUpdateFromDeck = useRef(false)

	const router = useRouter()
	const { slugId, slug } = router.query as EditDeckQuery

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

	const closeUrl = `/decks${slugId && slug ? `/${slugId}/${slug}` : ''}`
	const headDescription = `Edit ${deck?.name ?? 'your deck'} on memorize.ai.`

	useEffect(() => {
		if (!deck || didUpdateFromDeck.current) return

		didUpdateFromDeck.current = true

		setImageUrl(deck.imageUrl)
		setName(deck.name)
		setSubtitle(deck.subtitle)
		setDescription(deck.description)
		setSelectedTopics(deck.topics)
	}, [deck])

	const edit = useCallback(async () => {
		if (!(deck && currentUser)) return

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
			router.push(closeUrl)
		} catch (error) {
			setLoadingState(LoadingState.Fail)
			handleError(error)
		}
	}, [
		deck,
		currentUser,
		setLoadingState,
		router,
		closeUrl,
		description,
		image,
		name,
		selectedTopics,
		subtitle
	])

	const setImageAndUrl = useCallback(
		(image: File | null) => {
			setImageUrl(image && URL.createObjectURL(image))
			setImage(image)
		},
		[setImageUrl, setImage]
	)

	return (
		<Dashboard
			className={styles.root}
			sidebarClassName={styles.sidebar}
			contentClassName={styles.content}
			selection={Selection.Decks}
		>
			<Head
				title={`Edit ${deck?.name ?? 'deck'} | memorize.ai`}
				description={headDescription}
				breadcrumbs={url => [
					[
						{ name: 'Decks', url: '/decks' },
						{
							name: deck?.name ?? 'Deck',
							url: `/decks/${deck?.slugId ?? 'error'}/${
								deck ? encodeURIComponent(deck.slug) : 'error'
							}`
						},
						{ name: 'Edit', url }
					]
				]}
			/>
			<div className={styles.header}>
				<Link href={closeUrl}>
					<a className={styles.close}>
						<FontAwesomeIcon className={styles.closeIcon} icon={faTimes} />
					</a>
				</Link>
				<h1 className={styles.title}>
					Edit <span>{deck?.name ?? 'deck'}</span>
				</h1>
				<Button
					className={styles.submit}
					disabledClassName={styles.submitDisabled}
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
			<div className={styles.main}>
				<div className={cx(styles.box, { [styles.loading]: !deck })}>
					{deck ? (
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
					) : (
						<Loader size="24px" thickness="4px" color="#582efe" />
					)}
				</div>
			</div>
		</Dashboard>
	)
}

export default EditDeck
