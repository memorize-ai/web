import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'

import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import useQuery from '../../../hooks/useQuery'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useImageUrl from '../../../hooks/useImageUrl'
import Button from '../../shared/Button'
import Stars from '../../shared/Stars'
import { urlWithQuery, formatNumber } from '../../../utils'

import { ReactComponent as UserIcon } from '../../../images/icons/user.svg'
import { ReactComponent as ShareIcon } from '../../../images/icons/share.svg'
import { ReactComponent as DownloadIcon } from '../../../images/icons/download.svg'
import { ReactComponent as UsersIcon } from '../../../images/icons/users.svg'

export default (
	{ deck, hasDeck }: {
		deck: Deck
		hasDeck: boolean
	}
) => {
	const history = useHistory()
	const query = useQuery()
	
	const [currentUser] = useCurrentUser()
	const [imageUrl] = useImageUrl(deck)
	
	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	
	const get = async () => {
		if (!currentUser) {
			query.set('action', 'get')
			
			return history.push(urlWithQuery('/auth', {
				title: 'I heard that deck is great...',
				next: urlWithQuery(
					window.location.pathname,
					Object.fromEntries(query)
				)
			}))
		}
		
		try {
			setGetLoadingState(LoadingState.Loading)
			
			await deck[hasDeck ? 'remove' : 'get'](currentUser.id)
			
			setGetLoadingState(LoadingState.Success)
		} catch (error) {
			setGetLoadingState(LoadingState.Fail)
			
			alert(error.message)
			console.error(error)
		}
	}
	
	return (
		<div className="header">
			<img src={imageUrl ?? Deck.defaultImage} alt={deck.name} />
			<div className="content">
				<div className="top">
					<div className="left">
						<h1 className="name">
							{deck.name}
						</h1>
						<p className="subtitle">
							{deck.subtitle}
						</p>
						{(deck.creatorName = '...') && (
							<div className="creator">
								<UserIcon />
								<p>{deck.creatorName}</p>
							</div>
						)}
					</div>
					<div className="right">
						{hasDeck
							? (
								<>
									<Button
										className="remove"
										loaderSize="16px"
										loaderThickness="3px"
										loaderColor="white"
										loading={getLoadingState === LoadingState.Loading}
										disabled={false}
										onClick={get}
									>
										Remove
									</Button>
									<Link to={`/decks/${deck.slug}`} className="open">
										Open
									</Link>
								</>
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
						<button className="share" onClick={() => console.log('Share')}>
							<ShareIcon />
						</button>
					</div>
				</div>
				<div className="divider" />
				<div className="stats">
					<div className="rating">
						<Stars>{deck.averageRating}</Stars>
						<p>({formatNumber(deck.numberOfRatings)})</p>
					</div>
					<div className="divider" />
					<div className="downloads">
						<DownloadIcon />
						<p>({formatNumber(deck.numberOfDownloads)})</p>
					</div>
					<div className="divider" />
					<div className="current-users">
						<UsersIcon />
						<p>({formatNumber(deck.numberOfCurrentUsers)})</p>
					</div>
				</div>
			</div>
		</div>
	)
}
