import React, { useContext, useEffect } from 'react'

import firebase from '../../firebase'
import ActivityContext from '../../contexts/Activity'
import { setActivityNode } from '../../actions'
import ActivityNode, { getFirstVisibleDay } from '../../models/ActivityNode'
import useCurrentUser from '../../hooks/useCurrentUser'
import { handleError } from '../../utils'

import 'firebase/firestore'

import '../../scss/components/Activity.scss'

const firestore = firebase.firestore()

const Activity = () => {
	const [state, dispatch] = useContext(ActivityContext)
	
	const [currentUser] = useCurrentUser()
	
	useEffect(() => {
		if (!currentUser || ActivityNode.isObserving)
			return
		
		ActivityNode.isObserving = true
		
		firestore
			.collection(`users/${currentUser.id}/activity`)
			.where('day', '>=', getFirstVisibleDay())
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
					
				</div>
				<div className="months">
					
				</div>
				<div className="cells">
					<div className="past-cells">
						{}
					</div>
					<div className="current-cells">
						
					</div>
				</div>
			</div>
		</div>
	)
}

export default Activity
