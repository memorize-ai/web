import { useMemo, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import cx from 'classnames'

import firebase from 'lib/firebase'
import ActivityNode, {
	DAYS,
	MONTHS,
	getDay,
	getCurrentCount,
	getBeforeFirstVisibleDay,
	ActivityNodeData
} from 'models/ActivityNode'
import activityState from 'state/activity'
import handleError from 'lib/handleError'
import formatDate from 'lib/formatDate'

import styles from './index.module.scss'

import 'firebase/firestore'

const firestore = firebase.firestore()

interface ActivityCellProps {
	node: ActivityNode
	popUpDirection: 'up' | 'right' | 'left'
}

const ActivityCell = ({ node, popUpDirection }: ActivityCellProps) => (
	<span
		className={styles.cell}
		data-intensity={node.intensity}
		aria-label={`${formatDate(node.date)} - ${node.value} card${
			node.value === 1 ? '' : 's'
		}`}
		data-balloon-pos={popUpDirection}
	/>
)

export interface ActivityProps {
	className?: string
	id: string | null
	nodes?: Record<number, ActivityNodeData>
}

const Activity = ({ className, id, nodes: initialNodes }: ActivityProps) => {
	const [state, setState] = useRecoilState(activityState(id))

	const nodes = useMemo(() => {
		const count = ActivityNode.PAST_COUNT + getCurrentCount()
		const acc = new Array<ActivityNode>(count)

		// The first node
		const offset = getDay() - count + 1

		for (let i = 0; i < count; i++) {
			const day = offset + i

			const fromState = state[day]
			if (fromState) {
				acc[i] = fromState
				continue
			}

			const fromInitialNodes = initialNodes?.[day]
			if (fromInitialNodes) {
				acc[i] = new ActivityNode(fromInitialNodes)
				continue
			}

			acc[i] = new ActivityNode(ActivityNode.dataFromDay(day))
		}

		return acc
	}, [state, initialNodes])

	useEffect(() => {
		if (!id || ActivityNode.observers.has(id)) return

		ActivityNode.observers.add(id)

		firestore
			.collection(`users/${id}/activity`)
			.where('day', '>', getBeforeFirstVisibleDay())
			.onSnapshot(snapshot => {
				for (const { type, doc } of snapshot.docChanges()) {
					if (!(type === 'added' || type === 'modified')) continue

					const node = ActivityNode.fromSnapshot(doc)
					setState(state => ({ ...state, [node.day]: node }))
				}
			}, handleError)
	}, [id, setState])

	return (
		<div className={cx(styles.root, className)}>
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
	)
}

export default Activity
