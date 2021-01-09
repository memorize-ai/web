import { useState, useCallback } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons'

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
import { formatNumber, handleError } from 'lib/utils'

import { src as defaultImage } from 'images/logos/icon.jpg'
import user from 'images/icons/user.svg'
import share from 'images/icons/share.svg'
import download from 'images/icons/download.svg'
import users from 'images/icons/users.svg'

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
		<div className="header">
			<img src={deck.imageUrl ?? defaultImage} alt={deck.name} />
			<div className="content">
				<h1 className="name">{deck.name}</h1>
				<p className="subtitle">{deck.subtitle}</p>
				<div className="creator">
					<Svg src={user} />
					<p>{creator.name}</p>
					<p
						aria-label="Earn XP by gaining popularity on your decks"
						data-balloon-pos="up"
					>
						(lvl {creatorLevel})
					</p>
				</div>
				<div className="buttons">
					{hasDeck ? (
						<Link
							href={`/decks/${deck.slugId}/${encodeURIComponent(deck.slug)}`}
						>
							<a className="open">Open</a>
						</Link>
					) : (
						<Button
							className="get"
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
					<div className="secondary">
						{contactLoadingState === LoadingState.Fail || (
							<button
								className="contact"
								disabled={contactLoadingState !== LoadingState.Success}
								onClick={showContactUserModal}
							>
								{contactLoadingState === LoadingState.Loading ? (
									<Loader size="20px" thickness="4px" color="white" />
								) : (
									<FontAwesomeIcon icon={faComments} />
								)}
								<p>Chat</p>
							</button>
						)}
						<button
							className="share"
							onClick={() => setIsShareModalShowing(true)}
						>
							<Svg src={share} />
						</button>
					</div>
				</div>
			</div>
			<div className="stats">
				<a className="rating" href="#ratings">
					<Stars>{deck.averageRating}</Stars>
					<p>({formatNumber(deck.numberOfRatings)})</p>
				</a>
				<div className="divider" />
				<a className="downloads" href="#info">
					<Svg src={download} />
					<p>({formatNumber(deck.numberOfDownloads)})</p>
				</a>
				<div className="divider" />
				<a className="current-users" href="#info">
					<Svg src={users} />
					<p>({formatNumber(deck.numberOfCurrentUsers)})</p>
				</a>
				<div className="divider" />
				<a className="cards" href="#cards">
					{formatNumber(deck.numberOfCards)} card
					{deck.numberOfCards === 1 ? '' : 's'}
				</a>
				<div className="divider" />
				<a className="comments" href="#comments">
					<FontAwesomeIcon icon={faComments} />
					<p>
						(<CommentCount {...deck.disqusProps} />)
					</p>
				</a>
			</div>
			<ContactUserModal
				subjectPlaceholder={`I have a question about ${deck.name}`}
				bodyPlaceholder={`Hi ${creator?.name ?? '...'}...`}
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
