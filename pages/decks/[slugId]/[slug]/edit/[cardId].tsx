import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import property from 'lodash/property'
import { ParsedUrlQuery } from 'querystring'

import Section from 'models/Section'
import requiresAuth from 'hooks/requiresAuth'
import useCurrentUser from 'hooks/useCurrentUser'
import useCreatedDeck from 'hooks/useCreatedDeck'
import useSections from 'hooks/useSections'
import useCard from 'hooks/useCard'
import useLocalStorageBoolean from 'hooks/useLocalStorageBoolean'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head from 'components/Head'
import CKEditor from 'components/CKEditor'
import Loader from 'components/Loader'
import ConfirmationModal from 'components/Modal/Confirmation'
import { LOCAL_STORAGE_IS_CARD_EDITOR_STACKED_KEY } from 'lib/constants'

import { src as defaultImage } from 'images/logos/icon.jpg'

const INITIAL_SECTIONS: Section[] = []
const CONFIRM_CLOSE_MESSAGE =
	'Are you sure? You have unsaved changes that will be lost.'

interface EditCardQuery extends ParsedUrlQuery {
	slugId: string
	slug: string
	cardId: string
}

const EditCard = () => {
	requiresAuth()

	const router = useRouter()
	const { slugId, slug, cardId } = router.query as EditCardQuery

	const [currentUser] = useCurrentUser()

	const deck = useCreatedDeck(slugId, slug)

	const namedSections = useSections(deck?.id) ?? INITIAL_SECTIONS
	const sections = useMemo(
		() => (deck ? [deck.unsectionedSection, ...namedSections] : namedSections),
		[deck, namedSections]
	)

	const card = useCard(deck?.id, cardId)
	const [didUpdateFromCard, setDidUpdateFromCard] = useState(false)

	const [section, setSection] = useState(
		sections.find(({ id }) => id === card?.sectionId)
	)
	const [front, setFront] = useState(card?.front ?? '')
	const [back, setBack] = useState(card?.back ?? '')

	const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false)
	const [isCloseModalShowing, setIsCloseModalShowing] = useState(false)

	const [isEditorStacked, setIsEditorStacked] = useLocalStorageBoolean(
		LOCAL_STORAGE_IS_CARD_EDITOR_STACKED_KEY
	)

	const uploadUrl = useMemo(
		() => deck && currentUser && deck.uploadUrl(currentUser.id),
		[deck, currentUser]
	)

	const closeUrl = `/decks/${slugId ?? '...'}/${
		slug ? encodeURIComponent(slug) : '...'
	}`
	const headDescription = `Edit a card in ${deck?.name ?? 'your deck'}.`

	const isSameContent =
		section?.id === card?.sectionId &&
		front === card?.front &&
		back === card?.back

	useEffect(() => {
		if (!card) return

		if (!didUpdateFromCard) {
			setFront(card.front)
			setBack(card.back)

			setDidUpdateFromCard(true)
		}

		if (!section) {
			const newSection = sections.find(({ id }) => id === card.sectionId)

			if (newSection) setSection(newSection)
		}
	}, [card, didUpdateFromCard, section, sections])

	useEffect(() => {
		if (isSameContent) return

		window.onbeforeunload = () => CONFIRM_CLOSE_MESSAGE

		return () => {
			window.onbeforeunload = null
		}
	}, [isSameContent])

	const close = useCallback(() => {
		router.push(closeUrl)
	}, [router, closeUrl])

	const save = useCallback(async () => {
		if (!(deck && card)) return

		card.edit({
			deck,
			section: section ?? null,
			front,
			back
		})

		close()
	}, [deck, card, section, front, back, close])

	const deleteCard = useCallback(async () => {
		if (!(currentUser && deck && card)) return

		card.delete(currentUser, deck)

		setIsDeleteModalShowing(false)
		close()
	}, [currentUser, deck, card, setIsDeleteModalShowing, close])

	const onConfirmGoBack = useCallback(() => {
		setIsCloseModalShowing(false)
		close()
	}, [setIsCloseModalShowing, close])

	return (
		<Dashboard selection={Selection.Decks} className="edit-card">
			<Head
				title={`Edit card${deck ? ` | ${deck.name}` : ''} | memorize.ai`}
				description={headDescription}
				breadcrumbs={url => [
					[
						{ name: 'Decks', url: '/decks' },
						{
							name: deck?.name ?? 'Deck',
							url: `/decks/${deck?.slugId ?? '...'}/${
								deck ? encodeURIComponent(deck.slug) : '...'
							}`
						},
						{ name: 'Edit card', url }
					]
				]}
			/>
			<div className="header">
				<Link href={closeUrl}>
					<a
						className="close"
						onClick={event => {
							if (isSameContent) return

							event.preventDefault()
							setIsCloseModalShowing(true)
						}}
					>
						<FontAwesomeIcon icon={faTimes} />
					</a>
				</Link>
				<img src={deck?.imageUrl ?? defaultImage} alt="Deck" />
				<h1>Edit card</h1>
				<button
					className="save"
					disabled={!(front && back) || isSameContent}
					onClick={save}
					aria-label={
						front && back
							? isSameContent
								? "You didn't change anything!"
								: undefined
							: 'Cards must have a front and a back'
					}
					data-balloon-pos="left"
				>
					Save
				</button>
				<button
					className="delete"
					onClick={() => setIsDeleteModalShowing(true)}
				>
					<FontAwesomeIcon icon={faTrash} />
				</button>
			</div>
			<div className="content">
				<div
					className={cx('box', {
						loading: !(card && didUpdateFromCard)
					})}
				>
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
					<label>Choose section</label>
					<Select
						className="section-select"
						options={sections}
						getOptionLabel={property('name')}
						getOptionValue={property('id')}
						placeholder="Loading..."
						isLoading={!section}
						value={section}
						// eslint-disable-next-line
						onChange={setSection as any}
					/>
					<div className={cx('sides', { row: !isEditorStacked })}>
						{card && didUpdateFromCard && uploadUrl ? (
							<>
								<div>
									<div className="header">
										<FontAwesomeIcon
											className={cx({ valid: front })}
											icon={front ? faCheck : faTimes}
										/>
										<label>Front</label>
									</div>
									<CKEditor
										uploadUrl={uploadUrl}
										data={front}
										setData={setFront}
									/>
								</div>
								<div>
									<div className="header">
										<FontAwesomeIcon
											className={cx({ valid: back })}
											icon={back ? faCheck : faTimes}
										/>
										<label>Back</label>
									</div>
									<CKEditor
										uploadUrl={uploadUrl}
										data={back}
										setData={setBack}
									/>
								</div>
							</>
						) : (
							<Loader size="24px" thickness="4px" color="#582efe" />
						)}
					</div>
				</div>
			</div>
			<ConfirmationModal
				title="Go back"
				message={CONFIRM_CLOSE_MESSAGE}
				onConfirm={onConfirmGoBack}
				buttonText="I don't care"
				buttonBackground="#e53e3e"
				isShowing={isCloseModalShowing}
				setIsShowing={setIsCloseModalShowing}
			/>
			<ConfirmationModal
				title="Delete card"
				message="Are you sure? You can't go back!"
				onConfirm={deleteCard}
				buttonText="Delete"
				buttonBackground="#e53e3e"
				isShowing={isDeleteModalShowing}
				setIsShowing={setIsDeleteModalShowing}
			/>
		</Dashboard>
	)
}

export default EditCard
