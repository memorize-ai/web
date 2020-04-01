import React, { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import useImageUrl from '../../../hooks/useImageUrl'

import { ReactComponent as User } from '../../../images/icons/user.svg'

import '../../../scss/components/DeckCell/Base.scss'

export default (
	{ className, deck, href, children }: PropsWithChildren<{
		className?: string
		deck: Deck
		href: string
	}>
) => {
	const [imageUrl, imageUrlLoadingState] = useImageUrl(deck)
	
	return (
		<Link to={href} className={cx('deck-cell', className)}>
			{imageUrlLoadingState === LoadingState.Loading || (
				<img src={imageUrl ?? Deck.defaultImage} alt={deck.name} />
			)}
			<div className="content">
				<p className="name">
					{deck.name}
				</p>
				<p className="subtitle">
					This is a subtitle{deck.subtitle}
				</p>
				{deck.creatorName && (
					<div className="creator">
						<User />
						<p>{deck.creatorName}</p>
					</div>
				)}
				{children}
			</div>
		</Link>
	)
}
