import React, { PropsWithChildren, HTMLAttributes } from 'react'
import Link from 'next/link'
import cx from 'classnames'

import Deck from 'models/Deck'
import useImageUrl from 'hooks/useImageUrl'

import User from 'images/icons/user.svg'

import '../../../scss/components/DeckCell/Base.scss'

export default (
	{ className, deck, href, as, nameProps, children }: PropsWithChildren<{
		className?: string
		deck: Deck
		href: string
		as: string
		nameProps?: HTMLAttributes<HTMLParagraphElement>
	}>
) => {
	const [imageUrl] = useImageUrl(deck)
	
	return (
		<Link href={href} as={as}>
			<a
				className={cx('deck-cell', className)}
				itemScope
				itemID={deck.id}
				itemType="https://schema.org/IndividualProduct"
			>
				<img
					itemProp="image"
					src={imageUrl ?? Deck.DEFAULT_IMAGE_URL}
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
			</a>
		</Link>
	)
}
