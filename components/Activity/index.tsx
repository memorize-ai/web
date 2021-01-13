import { useMemo, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import cx from 'classnames'

import firebase from 'lib/firebase'
import ActivityNode, {
	DAYS,
	MONTHS,
	getDay,
	getCurrentCount,
	getBeforeFirstVisibleDay
} from 'models/ActivityNode'
import useCurrentUser from 'hooks/useCurrentUser'
import activityState from 'state/activity'
import { handleError, formatLongDate } from 'lib/utils'

import styles from './index.module.scss'

import 'firebase/firestore'

const firestore = firebase.firestore()

interface ActivityCellProps {
	node: ActivityNode
	popUpDirection: 'up' | 'right' | 'left'
}

const ActivityCell = ({ node, popUpDirection }: ActivityCellProps) => (
	<span
		className={cx(styles.cell, styles[`intensity_${node.intensity}`])}
		aria-label={`${formatLongDate(node.date)} - ${node.value} card${
			node.value === 1 ? '' : 's'
		}`}
		data-balloon-pos={popUpDirection}
	/>
)

export interface ActivityProps {
	className?: string
}

const Activity = ({ className }: ActivityProps) => {
	const [state, setState] = useRecoilState(activityState)
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
		if (!currentUser || ActivityNode.isObserving) return

		ActivityNode.isObserving = true

		firestore
			.collection(`users/${currentUser.id}/activity`)
			.where('day', '>', getBeforeFirstVisibleDay())
			.onSnapshot(snapshot => {
				for (const { type, doc } of snapshot.docChanges()) {
					if (!(type === 'added' || type === 'modified')) continue

					const node = ActivityNode.fromSnapshot(doc)
					setState(state => ({ ...state, [node.day]: node }))
				}
			}, handleError)
	}, [currentUser, setState])

	return (
		<div className={cx(styles.root, className)}>
			<div className={styles.content}>
				<div className={styles.days}>
					{DAYS.map(day => (
						<p key={day}>{day}</p>
					))}
				</div>
				<div className={styles.months}>
					{MONTHS.map(month => (
						<p key={month}>{month}</p>
					))}
				</div>
				<div className={styles.cells}>
					{nodes.map((node, i) => (
						<ActivityCell
							key={node.day}
							node={node}
							popUpDirection={
								i < 14
									? 'right'
									: i >= nodes.length - getCurrentCount() - 14
									? 'left'
									: 'up'
							}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default Activity
