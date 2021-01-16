import { useState, useCallback } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faComments } from '@fortawesome/free-solid-svg-icons'

import User from 'models/User'
import Deck from 'models/Deck'
import LoadingState from 'models/LoadingState'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useCurrentUser from 'hooks/useCurrentUser'
import useContactUserState from 'hooks/useContactUserState'
import useAuthModal from 'hooks/useAuthModal'
import Button from 'components/Button'
import Loader from 'components/Loader'
import Stars from 'components/Stars'
import CommentCount from 'components/Disqus/CommentCount'
import ContactUserModal from 'components/Modal/ContactUser'
import ShareDeckModal from 'components/Modal/ShareDeck'
import formatNumber from 'lib/formatNumber'
import handleError from 'lib/handleError'

import { src as defaultImage } from 'images/logos/icon.jpg'
import defaultUserImage from 'images/icons/user.svg'
import share from 'images/icons/share.svg'
import download from 'images/icons/download.svg'
import users from 'images/icons/users.svg'

import styles from './index.module.scss'

export interface DeckPageHeaderProps {
	deck: Deck
	creator: User
	hasDeck: boolean
}

const DeckPageHeader = ({ deck, creator, hasDeck }: DeckPageHeaderProps) => {
	const isSignedIn = useLayoutAuthState()
	const [currentUser] = useCurrentUser()

	const contactLoadingState = useContactUserState(creator)

	const {
		setIsShowing: setIsAuthModalShowing,
		setCallback: setAuthModalCallback
	} = useAuthModal()

	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	const [isShareModalShowing, setIsShareModalShowing] = useState(false)
	const [isContactUserModalShowing, setIsContactUserModalShowing] = useState(
		false
	)

	const creatorLevel = formatNumber(creator.level ?? 0)

	const showContactUserModal = useCallback(() => {
		isSignedIn
			? setIsContactUserModalShowing(true)
			: setIsAuthModalShowing(true)
	}, [isSignedIn, setIsContactUserModalShowing, setIsAuthModalShowing])

	const get = useCallback(() => {
		const callback = async (user: User) => {
			try {
				setGetLoadingState(LoadingState.Loading)

				await deck.get(user.id)

				setGetLoadingState(LoadingState.Success)

				Router.push(`/decks/${deck.slugId}/${encodeURIComponent(deck.slug)}`)
			} catch (error) {
				setGetLoadingState(LoadingState.Fail)
				handleError(error)
			}
		}

		if (currentUser) callback(currentUser)
		else {
			setIsAuthModalShowing(true)
			setAuthModalCallback(callback)
		}
	}, [setIsAuthModalShowing, setAuthModalCallback, currentUser, deck])

	return (
		<div className={styles.root}>
			<img
				className={styles.image}
				src={deck.imageUrl ?? defaultImage}
				alt={deck.name}
			/>
			<div className={styles.content}>
				<h1 className={styles.name}>{deck.name}</h1>
				<p className={styles.subtitle}>{deck.subtitle}</p>
				<Link
					href={`/u/${creator.slugId ?? 'error'}/${creator.slug ?? 'error'}`}
				>
					<a className={styles.creator}>
						{creator.imageUrl ? (
							<img
								className={styles.creatorImage}
								src={creator.imageUrl}
								alt={creator.name ?? 'Creator'}
							/>
						) : (
							<Svg
								className={styles.creatorDefaultImage}
								src={defaultUserImage}
								viewBox={`0 0 ${defaultUserImage.width} ${defaultUserImage.height}`}
							/>
						)}
						<span className={styles.creatorName}>
							{creator.name ?? 'Creator'}{' '}
							<span
								className={styles.creatorLevel}
								aria-label="Earn XP by gaining popularity on your decks"
								data-balloon-pos="up"
							>
								(lvl {creatorLevel})
							</span>
						</span>
						<FontAwesomeIcon
							className={styles.creatorIcon}
							icon={faChevronRight}
						/>
					</a>
				</Link>
				<div className={styles.actions}>
					{hasDeck ? (
						<Link
							href={`/decks/${deck.slugId}/${encodeURIComponent(deck.slug)}`}
						>
							<a className={styles.open}>Open</a>
						</Link>
					) : (
						<Button
							className={styles.get}
							loaderSize="16px"
							loaderThickness="3px"
							loaderColor="white"
							loading={getLoadingState === LoadingState.Loading}
							disabled={false}
							onClick={get}
						>
							Get
						</Button>
					)}
					<div className={styles.secondaryActions}>
						{contactLoadingState === LoadingState.Fail || (
							<button
								className={styles.contact}
								disabled={contactLoadingState !== LoadingState.Success}
								onClick={showContactUserModal}
							>
								{contactLoadingState === LoadingState.Loading ? (
									<Loader size="20px" thickness="4px" color="white" />
								) : (
									<FontAwesomeIcon
										className={styles.contactIcon}
										icon={faComments}
									/>
								)}
								<span className={styles.contactText}>Chat</span>
							</button>
						)}
						<button
							className={styles.share}
							onClick={() => setIsShareModalShowing(true)}
						>
							<Svg className={styles.shareIcon} src={share} />
						</button>
					</div>
				</div>
			</div>
			<div className={styles.stats}>
				<a className={styles.rating} href="#ratings">
					<Stars>{deck.averageRating}</Stars>
					<span className={styles.statText}>
						({formatNumber(deck.numberOfRatings)})
					</span>
				</a>
				<div className={styles.statDivider} />
				<a className={styles.downloads} href="#info">
					<Svg className={styles.statIcon} src={download} />
					<span className={styles.statText}>
						({formatNumber(deck.numberOfDownloads)})
					</span>
				</a>
				<div className={styles.statDivider} />
				<a className={styles.users} href="#info">
					<Svg className={styles.statIcon} src={users} />
					<span className={styles.statText}>
						({formatNumber(deck.numberOfCurrentUsers)})
					</span>
				</a>
				<div className={styles.statDivider} />
				<a className={styles.cards} href="#cards">
					{formatNumber(deck.numberOfCards)} card
					{deck.numberOfCards === 1 ? '' : 's'}
				</a>
				<div className={styles.statDivider} />
				<a className={styles.comments} href="#comments">
					<FontAwesomeIcon className={styles.commentsIcon} icon={faComments} />
					<span className={styles.commentsText}>
						(<CommentCount {...deck.disqusProps} />)
					</span>
				</a>
			</div>
			<ContactUserModal
				subjectPlaceholder={`I have a question about ${deck.name}`}
				bodyPlaceholder={`Hi ${creator.name}...`}
				user={creator}
				isShowing={isContactUserModalShowing}
				setIsShowing={setIsContactUserModalShowing}
			/>
			<ShareDeckModal
				deck={deck}
				isShowing={isShareModalShowing}
				setIsShowing={setIsShareModalShowing}
			/>
		</div>
	)
}

export default DeckPageHeader
