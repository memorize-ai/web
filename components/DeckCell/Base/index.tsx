import { HTMLAttributes, MouseEvent, ReactNode, useCallback } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Deck from 'models/Deck'

import { src as defaultImage } from 'images/logos/icon.jpg'
import defaultUserImage from 'images/icons/user.svg'

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
}: DeckCellBaseProps) => {
	const viewCreator = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.preventDefault()

			if (!deck.creator) return
			const { slugId, slug } = deck.creator

			Router.push(`/u/${slugId}/${slug}`)
		},
		[deck.creator]
	)

	return (
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
					{deck.creator && (
						<button className={styles.creator} onClick={viewCreator}>
							{deck.creatorImage ? (
								<img
									className={styles.creatorImage}
									src={deck.creatorImage}
									alt={deck.creator.name}
								/>
							) : (
								<Svg
									className={styles.creatorDefaultImage}
									src={defaultUserImage}
									viewBox={`0 0 ${defaultUserImage.width} ${defaultUserImage.height}`}
								/>
							)}
							<span className={styles.creatorName}>{deck.creator.name}</span>
							<FontAwesomeIcon
								className={styles.creatorIcon}
								icon={faChevronRight}
							/>
						</button>
					)}
					{children}
				</span>
			</a>
		</Link>
	)
}

export default DeckCellBase
