import { PropsWithChildren, HTMLAttributes } from 'react'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import cx from 'classnames'

import Deck from 'models/Deck'

import { src as defaultImage } from 'images/logos/icon.jpg'
import user from 'images/icons/user.svg'

const DeckCellBase = (
	{ className, deck, href, nameProps, children }: PropsWithChildren<{
		className?: string
		deck: Deck
		href: string
		nameProps?: HTMLAttributes<HTMLParagraphElement>
	}>
) => (
	<Link href={href}>
		<a
			className={cx('deck-cell', className)}
			itemScope
			itemID={deck.id}
			itemType="https://schema.org/IndividualProduct"
		>
			<img
				itemProp="image"
				src={deck.imageUrl ?? defaultImage}
				alt={deck.name}
				loading="lazy"
			/>
			<span className="content">
				<span {...nameProps} className="name" itemProp="name">
					{deck.name}
				</span>
				<span className="subtitle">
					{deck.subtitle}
				</span>
				<span hidden itemProp="description">
					{deck.description}
				</span>
				{deck.creatorName && (
					<span className="creator">
						<Svg src={user} />
						<span>{deck.creatorName}</span>
					</span>
				)}
				{children}
			</span>
		</a>
	</Link>
)

export default DeckCellBase
