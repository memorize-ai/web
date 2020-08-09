import React, { useContext, useEffect, useMemo } from 'react'

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

const Activity = () => {
	const [state, dispatch] = useContext(ActivityContext)
	
	const [currentUser] = useCurrentUser()
	
	const pastNodes = useMemo(() => {
		const count = ActivityNode.PAST_COUNT
		const nodes = new Array<ActivityNode>(count)
		
		// The first node
		const offset = getDay() - getCurrentCount() - count + 1
		
		for (let i = 0; i < count; i++)
			nodes[i] = state[offset + i] ?? new ActivityNode(offset + i, 0)
		
		return nodes
	}, [state])
	
	const currentNodes = useMemo(() => {
		const count = getCurrentCount()
		const nodes = new Array<ActivityNode>(count)
		
		// The first current node
		const offset = getDay() - count + 1
		
		for (let i = 0; i < count; i++)
			nodes[i] = state[offset + i] ?? new ActivityNode(offset + i, 0)
		
		return nodes
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
					<div className="past-cells">
						{pastNodes.map(node => (
							<div
								key={node.day}
								className="cell"
								aria-label={`${formatLongDate(node.date)} - ${node.value} card${node.value === 1 ? '' : 's'}`}
								data-balloon-pos="up"
							/>
						))}
					</div>
					<div className="current-cells">
						{currentNodes.map(node => (
							<div
								key={node.day}
								className="cell"
								aria-label={`${formatLongDate(node.date)} - ${node.value} card${node.value === 1 ? '' : 's'}`}
								data-balloon-pos="up"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Activity
