import React, { useState, useCallback } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons'

import User from '../../../models/User'
import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import useAuthState from '../../../hooks/useAuthState'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useCreator from '../../../hooks/useCreator'
import useContactUserLoadingState from '../../../hooks/useContactUserLoadingState'
import useAuthModal from '../../../hooks/useAuthModal'
import Button from '../../shared/Button'
import Loader from '../../shared/Loader'
import Stars from '../../shared/Stars'
import { DisqusCommentCount } from '../../shared/Disqus'
import ContactUserModal from '../../shared/Modal/ContactUser'
import ShareDeckModal from '../../shared/Modal/ShareDeck'
import { formatNumber, handleError } from '../../../utils'

import { ReactComponent as UserIcon } from '../../../images/icons/user.svg'
import { ReactComponent as ShareIcon } from '../../../images/icons/share.svg'
import { ReactComponent as DownloadIcon } from '../../../images/icons/download.svg'
import { ReactComponent as UsersIcon } from '../../../images/icons/users.svg'

const DeckPageHeader = ({ deck, hasDeck }: { deck: Deck, hasDeck: boolean }) => {
	const history = useHistory()
	
	const isSignedIn = useAuthState()
	const [currentUser] = useCurrentUser()
	
	const creator = useCreator(deck.creatorId)
	const contactLoadingState = useContactUserLoadingState(creator)
	
	const {
		setIsShowing: setIsAuthModalShowing,
		setCallback: setAuthModalCallback
	} = useAuthModal()
	
	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	const [isShareModalShowing, setIsShareModalShowing] = useState(false)
	const [isContactUserModalShowing, setIsContactUserModalShowing] = useState(false)
	
	const creatorName = creator?.name ?? '...'
	const creatorLevel = creator ? formatNumber(creator.level ?? 0) : '...'
	
	const showContactUserModal = useCallback(() => {
		(isSignedIn
			? setIsContactUserModalShowing
			: setIsAuthModalShowing
		)(true)
	}, [isSignedIn, setIsContactUserModalShowing, setIsAuthModalShowing])
	
	const get = useCallback(() => {
		const callback = async (user: User) => {
			try {
				setGetLoadingState(LoadingState.Loading)
				
				await deck.get(user.id)
				
				setGetLoadingState(LoadingState.Success)
				
				history.push(`/decks/${deck.slugId}/${deck.slug}`)
			} catch (error) {
				setGetLoadingState(LoadingState.Fail)
				handleError(error)
			}
		}
		
		if (currentUser)
			callback(currentUser)
		else {
			setIsAuthModalShowing(true)
			setAuthModalCallback(callback)
		}
	}, [setIsAuthModalShowing, setAuthModalCallback, currentUser, deck, history])
	
	return (
		<div className="header">
			<img src={deck.imageUrl ?? Deck.DEFAULT_IMAGE_URL} alt={deck.name} />
			<div className="content">
				<h1 className="name">
					{deck.name}
				</h1>
				<p className="subtitle">
					{deck.subtitle}
				</p>
				<div className="creator">
					<UserIcon />
					<p>{creatorName}</p>
					<p
						aria-label="Earn XP by gaining popularity on your decks"
						data-balloon-pos="up"
					>
						(lvl {creatorLevel})
					</p>
				</div>
				<div className="buttons">
					{hasDeck
						? (
							<Link to={`/decks/${deck.slugId}/${deck.slug}`} className="open">
								Open
							</Link>
						)
						: (
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
						)
					}
					<div className="secondary">
						{contactLoadingState === LoadingState.Fail || (
							<button
								className="contact"
								disabled={contactLoadingState !== LoadingState.Success}
								onClick={showContactUserModal}
							>
								{contactLoadingState === LoadingState.Loading
									? <Loader size="20px" thickness="4px" color="white" />
									: <FontAwesomeIcon icon={faComments} />
								}
								<p>Chat</p>
							</button>
						)}
						<button
							className="share"
							onClick={() => setIsShareModalShowing(true)}
						>
							<ShareIcon />
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
					<DownloadIcon />
					<p>({formatNumber(deck.numberOfDownloads)})</p>
				</a>
				<div className="divider" />
				<a className="current-users" href="#info">
					<UsersIcon />
					<p>({formatNumber(deck.numberOfCurrentUsers)})</p>
				</a>
				<div className="divider" />
				<a className="cards" href="#cards">
					{formatNumber(deck.numberOfCards)} card{deck.numberOfCards === 1 ? '' : 's'}
				</a>
				<div className="divider" />
				<a className="comments" href="#comments">
					<FontAwesomeIcon icon={faComments} />
					<p>(<DisqusCommentCount {...deck.disqusProps} />)</p>
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
