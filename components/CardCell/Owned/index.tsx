import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import User from 'models/User'
import Deck from 'models/Deck'
import Card from 'models/Card'
import useCurrentUser from 'hooks/useCurrentUser'
import Base from '../Base'

import pencil from 'images/icons/pencil.svg'
import styles from './index.module.scss'
import { HTMLAttributes } from 'react'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

interface OwnedCardCellContentProps {
	currentUser: User
	deck: Deck
	card: Card
}

const OwnedCardCellContent = ({
	currentUser,
	deck,
	card
}: OwnedCardCellContentProps) => {
	const { isDue, userData } = card
	const isOwner = currentUser?.id === deck.creatorId
	const isNew = userData?.isNew ?? true

	return (
		<>
			<Base card={card} />
			{isDue && <div className={styles.dueBadge} />}
			{(userData || isOwner) && (
				<div className={cx(styles.footer, { [styles.hasUserData]: userData })}>
					{userData && (
						<p className={styles.dueDate}>
							Due {timeAgo.format(userData?.dueDate)}
						</p>
					)}
					{isOwner && (
						<div className={styles.edit}>
							<Svg className={styles.editIcon} src={pencil} />
							<p className={styles.editText}>Click to edit</p>
						</div>
					)}
					{userData && (
						<p className={styles.stats}>
							{isNew ? (
								"You haven't seen this card before"
							) : (
								<>
									<FontAwesomeIcon
										className={styles.streakIcon}
										icon={faBolt}
									/>
									{userData?.streak ?? 1}x streak
								</>
							)}
						</p>
					)}
				</div>
			)}
		</>
	)
}

export interface OwnedCardCellProps {
	className?: string
	deck: Deck
	card: Card
}

const OwnedCardCell = ({ className, deck, card }: OwnedCardCellProps) => {
	const [currentUser] = useCurrentUser()
	const isOwner = currentUser?.id === deck.creatorId

	if (!currentUser) return null

	const containerProps: HTMLAttributes<HTMLElement> = {
		className: cx(styles.root, className, { [styles.owner]: isOwner })
	}
	const contentProps: OwnedCardCellContentProps = { currentUser, deck, card }

	return isOwner ? (
		<Link
			href={`/decks/${deck.slugId}/${encodeURIComponent(deck.slug)}/edit/${
				card.id
			}`}
		>
			<a {...containerProps}>
				<OwnedCardCellContent {...contentProps} />
			</a>
		</Link>
	) : (
		<div {...containerProps}>
			<OwnedCardCellContent {...contentProps} />
		</div>
	)
}

export default OwnedCardCell
