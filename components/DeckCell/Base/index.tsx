import { HTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import cx from 'classnames'

import Deck from 'models/Deck'

import { src as defaultImage } from 'images/logos/icon.jpg'
import user from 'images/icons/user.svg'

import styles from './index.module.scss'

export interface DeckCellBaseProps {
	className?: string
	contentClassName?: string
	deck: Deck
	href: string
	nameProps?: HTMLAttributes<HTMLParagraphElement>
	children?: ReactNode
}

const DeckCellBase = ({
	className,
	contentClassName,
	deck,
	href,
	nameProps,
	children
}: DeckCellBaseProps) => (
	<Link href={href}>
		<a
			className={cx(styles.root, className)}
			itemScope
			itemID={deck.id}
			itemType="https://schema.org/IndividualProduct"
		>
			<img
				className={styles.image}
				itemProp="image"
				src={deck.imageUrl ?? defaultImage}
				alt={deck.name}
				loading="lazy"
			/>
			<span className={cx(styles.content, contentClassName)}>
				<span {...nameProps} className={styles.name} itemProp="name">
					{deck.name}
				</span>
				<span className={styles.subtitle}>{deck.subtitle}</span>
				<span hidden itemProp="description">
					{deck.description}
				</span>
				{deck.creatorName && (
					<span className={styles.creator}>
						<Svg className={styles.creatorIcon} src={user} />
						<span className={styles.creatorName}>{deck.creatorName}</span>
					</span>
				)}
				{children}
			</span>
		</a>
	</Link>
)

export default DeckCellBase
