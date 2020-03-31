import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import useImageUrl from '../../../hooks/useImageUrl'

import '../../../scss/components/DeckCell/Base.scss'

export default (
	{ className, deck, href }: {
		className?: string
		deck: Deck
		href: string
	}
) => {
	const [imageUrl, imageUrlLoadingState] = useImageUrl(deck)
	
	return (
		<Link to={href} className={cx('deck-cell', className)}>
			{imageUrlLoadingState === LoadingState.Loading || (
				<img src={imageUrl ?? Deck.defaultImage} alt={deck.name} />
			)}
			<div className="content">
				<h1 className="name">
					{deck.name}
				</h1>
				<h3 className="subtitle">
					{deck.subtitle}
				</h3>
			</div>
		</Link>
	)
}
