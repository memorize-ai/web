import React, { useState, useCallback } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'

import User from 'models/User'
import Deck from 'models/Deck'
import LoadingState from 'models/LoadingState'
import useCurrentUser from 'hooks/useCurrentUser'
import useImageUrl from 'hooks/useImageUrl'
import useCreator from 'hooks/useCreator'
import useAuthModal from 'hooks/useAuthModal'
import Button from 'components/shared/Button'
import Stars from 'components/shared/Stars'
import { DisqusCommentCount } from 'components/shared/Disqus'
import ShareDeckModal from 'components/shared/Modal/ShareDeck'
import { formatNumber, handleError } from 'lib/utils'

import UserIcon from 'images/icons/user.svg'
import ShareIcon from 'images/icons/share.svg'
import DownloadIcon from 'images/icons/download.svg'
import UsersIcon from 'images/icons/users.svg'

export default ({ deck, hasDeck }: { deck: Deck, hasDeck: boolean }) => {
	const [currentUser] = useCurrentUser()
	const [imageUrl] = useImageUrl(deck)
	const creator = useCreator(deck.creatorId)
	
	const [[, setAuthModalIsShowing], [, setAuthModalCallback]] = useAuthModal()
	
	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	const [isShareModalShowing, setIsShareModalShowing] = useState(false)
	
	const creatorName = creator?.name ?? '...'
	const creatorLevel = creator ? formatNumber(creator.level ?? 0) : '...'
	
	const get = useCallback(() => {
		const callback = async (user: User) => {
			try {
				setGetLoadingState(LoadingState.Loading)
				
				await deck.get(user.id)
				
				setGetLoadingState(LoadingState.Success)
				
				Router.push(
					'/decks/[slugId]/[slug]',
					`/decks/${deck.slugId}/${deck.slug}`
				)
			} catch (error) {
				setGetLoadingState(LoadingState.Fail)
				handleError(error)
			}
		}
		
		if (currentUser)
			callback(currentUser)
		else {
			setAuthModalIsShowing(true)
			setAuthModalCallback(callback)
		}
	}, [setAuthModalIsShowing, setAuthModalCallback, currentUser, deck, history])
	
	return (
		<div className="header">
			<img src={imageUrl ?? Deck.DEFAULT_IMAGE_URL} alt={deck.name} />
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
							<Link
								href="/decks/[slugId]/[slug]"
								as={`/decks/${deck.slugId}/${deck.slug}`}
							>
								<a className="open">Open</a>
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
					<button
						className="share"
						onClick={() => setIsShareModalShowing(true)}
					>
						<ShareIcon />
					</button>
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
					<FontAwesomeIcon icon={faComment} />
					<p>(<DisqusCommentCount {...deck.disqusProps} />)</p>
				</a>
			</div>
			<ShareDeckModal
				deck={deck}
				isShowing={isShareModalShowing}
				setIsShowing={setIsShareModalShowing}
			/>
		</div>
	)
}
