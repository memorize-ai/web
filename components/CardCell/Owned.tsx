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
import Base from './Base'

import pencil from 'images/icons/pencil.svg'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

const OwnedCardCellContent = ({
	currentUser,
	deck,
	card
}: {
	currentUser: User
	deck: Deck
	card: Card
}) => {
	const { isDue, userData } = card
	const isOwner = currentUser?.id === deck.creatorId
	const isNew = userData?.isNew ?? true

	return (
		<>
			<Base card={card} />
			{isDue && <div className="due-badge" />}
			{(userData || isOwner) && (
				<div className={cx('footer', { 'has-user-data': userData })}>
					{userData && (
						<p className="due-date">Due {timeAgo.format(userData?.dueDate)}</p>
					)}
					{isOwner && (
						<div className="edit-message">
							<Svg src={pencil} />
							<p>Click to edit</p>
						</div>
					)}
					{userData && (
						<p className={cx('stats', { new: isNew })}>
							{isNew ? (
								"You haven't seen this card before"
							) : (
								<>
									<FontAwesomeIcon icon={faBolt} />
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

const OwnedCardCell = ({ deck, card }: { deck: Deck; card: Card }) => {
	const [currentUser] = useCurrentUser()
	const isOwner = currentUser?.id === deck.creatorId

	if (!currentUser) return null

	const containerProps = {
		className: cx('card-cell', 'owned', { owner: isOwner })
	}
	const contentProps = { currentUser, deck, card }

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
