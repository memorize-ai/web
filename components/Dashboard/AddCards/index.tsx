import { useState, useEffect, useMemo, useContext, useCallback } from 'react'
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
import { ParsedUrlQuery } from 'querystring'

import Section from 'models/Section'
import AddCardsContext from 'contexts/AddCards'
import requiresAuth from 'hooks/requiresAuth'
import useCurrentUser from 'hooks/useCurrentUser'
import useCreatedDeck from 'hooks/useCreatedDeck'
import useSections from 'hooks/useSections'
import useLocalStorageBoolean from 'hooks/useLocalStorageBoolean'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head from 'components/Head'
import CardRow from 'components/AddCardRow'
import Loader from 'components/Loader'
import ConfirmationModal from 'components/Modal/Confirmation'
import {
	addCardsSet as set,
	addCardsAdd as add,
	addCardsUpdate as update,
	addCardsRemove as remove,
	addCardsRemoveAll as removeAll
} from 'actions'
import { compose } from 'lib/utils'
import { LOCAL_STORAGE_IS_CARD_EDITOR_STACKED_KEY } from 'lib/constants'

import { src as defaultImage } from 'images/logos/icon.jpg'

const GO_BACK_MESSAGE = 'Your drafts will be kept during this session.'
const CONFIRM_CLOSE_MESSAGE = 'Are you sure? Your drafts will be lost.'

interface AddCardsQuery extends ParsedUrlQuery {
	slugId: string
	slug: string
	sectionId: string
}

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

	const [cards, dispatch] = useContext(AddCardsContext)

	const hasDrafts = useMemo(
		() => cards.some(({ front, back }) => front || back),
		[cards]
	)

	const numberOfValidCards = useMemo(
		() =>
			cards.reduce((acc, { front, back }) => acc + (front && back ? 1 : 0), 0),
		[cards]
	)

	const closeUrl = `/decks/${slugId}/${slug}`
	const headDescription = `Add cards to ${deck?.name ?? 'your deck'}.`

	const canPublish = numberOfValidCards > 0

	useEffect(() => {
		if (!canPublish) return

		window.onbeforeunload = () => CONFIRM_CLOSE_MESSAGE

		return () => {
			window.onbeforeunload = null
		}
	}, [canPublish])

	const close = useCallback(() => router.push(closeUrl), [router, closeUrl])

	const setSection = useCallback(
		(section: Section | undefined) =>
			router.push(
				`/decks/${deck?.slugId ?? ''}/${deck?.slug ?? ''}/add${
					!section || section.isUnsectioned ? '' : `/${section.id}`
				}`
			),
		[router, deck]
	)

	const publish = useCallback(async () => {
		if (!(currentUser && deck && section)) return

		const validCards = cards.filter(({ front, back }) => front && back)
		const remainingCards = cards.filter(({ front, back }) => !(front && back))

		section.publishCards(currentUser, deck, validCards)
		dispatch(set(remainingCards))

		if (!remainingCards.length) close()
	}, [currentUser, deck, section, dispatch, close, cards])

	const onConfirmGoBack = useCallback(() => {
		setIsCloseModalShowing(false)
		close()
	}, [setIsCloseModalShowing, close])

	const onConfirmDeleteDrafts = useCallback(compose(dispatch, removeAll), [
		dispatch
	])

	return (
		<Dashboard selection={Selection.Decks} className="add-cards">
			<Head
				title={`Add cards${deck ? ` to ${deck.name}` : ''} | memorize.ai`}
				description={headDescription}
				breadcrumbs={url => [
					[
						{ name: 'Decks', url: '/decks' },
						{
							name: deck?.name ?? 'Deck',
							url: `/decks/${deck?.slugId ?? '...'}/${deck?.slug ?? '...'}`
						},
						{ name: 'Add cards', url }
					]
				]}
			/>
			<div className="header">
				<Link href={closeUrl}>
					<a
						className="close"
						onClick={event => {
							if (!hasDrafts) return

							event.preventDefault()
							setIsCloseModalShowing(true)
						}}
					>
						<FontAwesomeIcon icon={faTimes} />
					</a>
				</Link>
				<img src={deck?.imageUrl ?? defaultImage} alt="Deck" />
				<h1>Add cards</h1>
				<button
					className="save"
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
					className="delete"
					disabled={cards.length <= 1 && !hasDrafts}
					onClick={() => setIsDeleteDraftsModalShowing(true)}
				>
					<FontAwesomeIcon icon={faTrash} />
				</button>
			</div>
			<div className="content">
				<div className={cx('box', { loading: !deck })}>
					<div className="header">
						<p className="name">{deck?.name ?? 'Loading...'}</p>
						<button
							className="row-toggle"
							onClick={() => setIsEditorStacked(!isEditorStacked)}
						>
							<div
								className={cx('check', {
									on: !isEditorStacked
								})}
							>
								<FontAwesomeIcon icon={faCheck} />
							</div>
							<p>Side by side</p>
						</button>
					</div>
					<label>Add cards to...</label>
					<Select
						className="section-select"
						options={sections}
						getOptionLabel={property('name')}
						getOptionValue={property('id')}
						placeholder="Loading..."
						isLoading={!section}
						value={section}
						onChange={setSection}
					/>
					<div className="content">
						{deck ? (
							<>
								<div
									className={cx('cards', {
										row: !isEditorStacked
									})}
								>
									{cards.map(({ id, front, back }) => (
										<CardRow
											key={id}
											uploadUrl={
												currentUser ? deck.uploadUrl(currentUser.id) : ''
											}
											front={front}
											back={back}
											canRemove={hasDrafts}
											remove={() => dispatch(remove(id))}
											updateFront={front => dispatch(update(id, { front }))}
											updateBack={back => dispatch(update(id, { back }))}
										/>
									))}
								</div>
								<button onClick={compose(dispatch, add)}>
									<FontAwesomeIcon icon={faPlus} />
									<p>Card below</p>
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
