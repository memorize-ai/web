import React from 'react'
import cx from 'classnames'

import Topic from '../../../models/Topic'
import useCurrentUser from '../../../hooks/useCurrentUser'

export default ({ topic }: { topic: Topic }) => {
	const [currentUser] = useCurrentUser()
	
	return (
		<button
			className={cx({
				selected: currentUser?.interestIds?.includes(topic.id) ?? false
			})}
			onClick={() => currentUser?.toggleInterest(topic.id)}
		>
			<img src={topic.imageUrl} alt={topic.name} />
			<p>{topic.name}</p>
		</button>
	)
}
