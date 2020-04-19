import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import Card from '../../../models/Card'
import useCurrentUser from '../../../hooks/useCurrentUser'
import Base from './Base'

import { ReactComponent as PencilIcon } from '../../../images/icons/pencil.svg'

import '../../../scss/components/CardCell/Owned.scss'

TimeAgo.addLocale(enLocale)

const timeAgo = new TimeAgo('en-US')

export default (
	{ deck, card, onClick }: {
		deck: Deck
		card: Card
		onClick: () => void
	}
) => {
	const [currentUser] = useCurrentUser()
	
	const { userData, isDue } = card
	const isOwner = currentUser?.id === deck.creatorId
	const isNew = userData?.isNew ?? true
	
	return (
		<Base
			className={cx('owned', { owner: isOwner })}
			card={card}
			onClick={() => isOwner && onClick()}
			aria-label={isDue ? 'Download our iOS app to review' : undefined}
			data-balloon-pos={isDue ? 'up' : undefined}
		>
			{isDue && <div className="due-badge" />}
			{(userData || isOwner) && (
				<div className={cx('footer', { 'has-user-data': userData })}>
					{userData && (
						<p className="due-date">
							Due {timeAgo.format(userData?.dueDate)}
						</p>
					)}
					{isOwner && (
						<div className="edit-message">
							<PencilIcon />
							<p>Click to edit</p>
						</div>
					)}
					{userData && (
						<p className={cx('stats', { new: isNew })}>
							{isNew
								? 'You haven\'t seen this card before'
								: (
									<>
										<FontAwesomeIcon icon={faBolt} />
										{userData?.streak ?? 1}x streak
									</>
								)
							}
						</p>
					)}
				</div>
			)}
		</Base>
	)
}
