import React, { PropsWithChildren, HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import Deck from '../../../models/Deck'

import { ReactComponent as User } from '../../../images/icons/user.svg'

import '../../../scss/components/DeckCell/Base.scss'

const DeckCellBase = (
	{ className, deck, href, nameProps, children }: PropsWithChildren<{
		className?: string
		deck: Deck
		href: string
		nameProps?: HTMLAttributes<HTMLParagraphElement>
	}>
) => (
	<Link
		to={href}
		className={cx('deck-cell', className)}
		itemScope
		itemID={deck.id}
		itemType="https://schema.org/IndividualProduct"
	>
		<img
			itemProp="image"
			src={deck.imageUrl ?? Deck.DEFAULT_IMAGE_URL}
			alt={deck.name}
		/>
		<div className="content">
			<p {...nameProps} className="name" itemProp="name">
				{deck.name}
			</p>
			<p className="subtitle">
				{deck.subtitle}
			</p>
			<p hidden itemProp="description">
				{deck.description}
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

export default DeckCellBase
