import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faTimes,
	faTrash,
	faCheck,
	faPlus
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import property from 'lodash/property'

import { AddCardsQuery } from './models'
import Section from 'models/Section'
import requiresAuth from 'hooks/requiresAuth'
import useCloseMessage from 'hooks/useCloseMessage'
import useCurrentUser from 'hooks/useCurrentUser'
import useCreatedDeck from 'hooks/useCreatedDeck'
import useSections from 'hooks/useSections'
import useAddCardsState from 'hooks/useAddCardsState'
import useLocalStorageBoolean from 'hooks/useLocalStorageBoolean'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head from 'components/Head'
import Row from './Row'
import Loader from 'components/Loader'
import ConfirmationModal from 'components/Modal/Confirmation'
import { LOCAL_STORAGE_IS_CARD_EDITOR_STACKED_KEY } from 'lib/constants'

import { src as defaultImage } from 'images/logos/icon.jpg'
import styles from './index.module.scss'

const GO_BACK_MESSAGE = 'Your drafts will be kept during this session.'
const CONFIRM_CLOSE_MESSAGE = 'Are you sure? Your drafts will be lost.'

const AddCards = () => {
	requiresAuth()

	const router = useRouter()
	const { slugId, slug, sectionId } = router.query as AddCardsQuery

	const [currentUser] = useCurrentUser()

	const deck = useCreatedDeck(slugId, slug)

	const namedSections = useSections(deck?.id) ?? []
	const sections = deck
		? [deck.unsectionedSection, ...namedSections]
		: namedSections

	const [isDeleteDraftsModalShowing, setIsDeleteDraftsModalShowing] = useState(
		false
	)
	const [isCloseModalShowing, setIsCloseModalShowing] = useState(false)

	const [isEditorStacked, setIsEditorStacked] = useLocalStorageBoolean(
		LOCAL_STORAGE_IS_CARD_EDITOR_STACKED_KEY
	)

	const section = useMemo(
		() => sections.find(({ id }) => id === (sectionId ?? '')),
		[sections, sectionId]
	)

	const {
		cards,
		setCards,
		addCard,
		updateCard,
		removeCard
	} = useAddCardsState()

	const hasDrafts = useMemo(
		() => cards.some(({ front, back }) => front || back),
		[cards]
	)

	const numberOfValidCards = useMemo(
		() =>
			cards.reduce((acc, { front, back }) => acc + (front && back ? 1 : 0), 0),
		[cards]
	)

	const closeUrl = `/decks/${slugId}/${encodeURIComponent(slug)}`
	const headDescription = `Add cards to ${deck?.name ?? 'your deck'}.`

	const canPublish = numberOfValidCards > 0
	useCloseMessage(canPublish ? CONFIRM_CLOSE_MESSAGE : null)

	const close = useCallback(() => router.push(closeUrl), [router, closeUrl])

	const setSection = useCallback(
		(section: Section | undefined) =>
			router.push(
				`/decks/${deck?.slugId ?? ''}/${
					deck ? encodeURIComponent(deck.slug) : ''
				}/add${!section || section.isUnsectioned ? '' : `/${section.id}`}`
			),
		[router, deck]
	)

	const publish = useCallback(async () => {
		if (!(currentUser && deck && section)) return

		const validCards = cards.filter(({ front, back }) => front && back)
		const remainingCards = cards.filter(({ front, back }) => !(front && back))

		section.publishCards(currentUser, deck, validCards)
		setCards(remainingCards)

		if (!remainingCards.length) close()
	}, [currentUser, deck, section, cards, setCards, close])

	const onConfirmGoBack = useCallback(() => {
		setIsCloseModalShowing(false)
		close()
	}, [setIsCloseModalShowing, close])

	const onConfirmDeleteDrafts = useCallback(() => {
		setCards([])
	}, [setCards])

	return (
		<Dashboard
			className={styles.root}
			sidebarClassName={styles.sidebar}
			contentClassName={styles.content}
			selection={Selection.Decks}
		>
			<Head
				title={`Add cards${deck ? ` to ${deck.name}` : ''} | memorize.ai`}
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
						{ name: 'Add cards', url }
					]
				]}
			/>
			<div className={styles.header}>
				<Link href={closeUrl}>
					<a
						className={styles.close}
						onClick={event => {
							if (!hasDrafts) return

							event.preventDefault()
							setIsCloseModalShowing(true)
						}}
					>
						<FontAwesomeIcon className={styles.closeIcon} icon={faTimes} />
					</a>
				</Link>
				<img
					className={styles.image}
					src={deck?.imageUrl ?? defaultImage}
					alt="Deck"
				/>
				<h1 className={styles.title}>Add cards</h1>
				<button
					className={styles.save}
					disabled={!canPublish}
					onClick={publish}
					aria-label={
						canPublish
							? undefined
							: 'You have no publishable cards. Cards must have a front and a back.'
					}
					data-balloon-pos="left"
				>
					Publish
					{numberOfValidCards
						? ` ${numberOfValidCards} card${
								numberOfValidCards === 1 ? '' : 's'
						  }`
						: ''}
				</button>
				<button
					className={styles.delete}
					disabled={cards.length <= 1 && !hasDrafts}
					onClick={() => setIsDeleteDraftsModalShowing(true)}
				>
					<FontAwesomeIcon className={styles.deleteIcon} icon={faTrash} />
				</button>
			</div>
			<div className={styles.main}>
				<div className={cx(styles.box, { [styles.loading]: !deck })}>
					<div className={styles.boxHeader}>
						<p className={styles.name}>{deck?.name ?? 'Loading...'}</p>
						<button
							className={styles.rowToggle}
							onClick={() => setIsEditorStacked(!isEditorStacked)}
						>
							<div
								className={cx(styles.rowToggleCheck, {
									[styles.rowToggleCheckOn]: !isEditorStacked
								})}
							>
								<FontAwesomeIcon
									className={styles.rowToggleCheckIcon}
									icon={faCheck}
								/>
							</div>
							<p className={styles.rowToggleText}>Side by side</p>
						</button>
					</div>
					<label className={styles.sectionLabel}>Add cards to...</label>
					<Select
						className={styles.section}
						options={sections}
						getOptionLabel={property('name')}
						getOptionValue={property('id')}
						placeholder="Loading..."
						isLoading={!section}
						value={section}
						// eslint-disable-next-line
						onChange={setSection as any}
					/>
					<div className={styles.boxContent}>
						{deck ? (
							<>
								<div className={styles.cards}>
									{cards.map(({ id, front, back }) => (
										<Row
											key={id}
											isStacked={isEditorStacked}
											uploadUrl={
												currentUser ? deck.uploadUrl(currentUser.id) : ''
											}
											front={front}
											back={back}
											canRemove={hasDrafts}
											remove={() => removeCard(id)}
											updateFront={front => updateCard(id, { front })}
											updateBack={back => updateCard(id, { back })}
										/>
									))}
								</div>
								<button className={styles.add} onClick={addCard}>
									<FontAwesomeIcon className={styles.addIcon} icon={faPlus} />
									<span className={styles.addText}>Card below</span>
								</button>
							</>
						) : (
							<Loader size="24px" thickness="4px" color="#582efe" />
						)}
					</div>
				</div>
			</div>
			<ConfirmationModal
				title="Go back"
				message={GO_BACK_MESSAGE}
				onConfirm={onConfirmGoBack}
				buttonText="Ok, take me back"
				buttonBackground="#e53e3e"
				isShowing={isCloseModalShowing}
				setIsShowing={setIsCloseModalShowing}
			/>
			<ConfirmationModal
				title="Delete drafts"
				message="Are you sure? You can't go back!"
				onConfirm={onConfirmDeleteDrafts}
				buttonText="Delete"
				buttonBackground="#e53e3e"
				isShowing={isDeleteDraftsModalShowing}
				setIsShowing={setIsDeleteDraftsModalShowing}
			/>
		</Dashboard>
	)
}

export default AddCards
