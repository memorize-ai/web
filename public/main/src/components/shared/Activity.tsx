import React, { useContext, useEffect, useMemo, memo } from 'react'

import firebase from '../../firebase'
import ActivityContext from '../../contexts/Activity'
import { setActivityNode } from '../../actions'
import ActivityNode, {
	DAYS,
	MONTHS,
	getDay,
	getCurrentCount,
	getBeforeFirstVisibleDay
} from '../../models/ActivityNode'
import useCurrentUser from '../../hooks/useCurrentUser'
import { handleError, formatLongDate } from '../../utils'

import 'firebase/firestore'

import '../../scss/components/Activity.scss'

const firestore = firebase.firestore()

const ActivityCell = ({ node, popUpDirection }: {
	node: ActivityNode
	popUpDirection: 'up' | 'right' | 'left'
}) => (
	<span
		className={`cell intensity-${node.intensity}`}
		aria-label={`${formatLongDate(node.date)} - ${node.value} card${node.value === 1 ? '' : 's'}`}
		data-balloon-pos={popUpDirection}
	/>
)

const Activity = () => {
	const [state, dispatch] = useContext(ActivityContext)
	
	const [currentUser] = useCurrentUser()
	
	const nodes = useMemo(() => {
		const count = ActivityNode.PAST_COUNT + getCurrentCount()
		const acc = new Array<ActivityNode>(count)
		
		// The first node
		const offset = getDay() - count + 1
		
		for (let i = 0; i < count; i++)
			acc[i] = state[offset + i] ?? new ActivityNode(offset + i, 0)
		
		return acc
	}, [state])
	
	useEffect(() => {
		if (!currentUser || ActivityNode.isObserving)
			return
		
		ActivityNode.isObserving = true
		
		firestore
			.collection(`users/${currentUser.id}/activity`)
			.where('day', '>', getBeforeFirstVisibleDay())
			.onSnapshot(snapshot => {
				for (const { type, doc } of snapshot.docChanges())
					if (type === 'added' || type === 'modified')
						dispatch(setActivityNode(ActivityNode.fromSnapshot(doc)))
			}, handleError)
	}, [currentUser, dispatch])
	
	return (
		<div className="activity">
			<div className="content">
				<div className="days">
					{DAYS.map(day => <p key={day}>{day}</p>)}
				</div>
				<div className="months">
					{MONTHS.map(month => <p key={month}>{month}</p>)}
				</div>
				<div className="cells">
					{nodes.map((node, i) => (
						<ActivityCell
							key={node.day}
							node={node}
							// Last two columns
							popUpDirection={i >= nodes.length - getCurrentCount() - 14 ? 'left' : 'up'}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default memo(Activity)
