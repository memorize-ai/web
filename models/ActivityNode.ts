import SnapshotLike from './SnapshotLike'

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24

export const DAYS = ['Mon', 'Wed', 'Fri']

export const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
]
MONTHS.unshift(...MONTHS.splice(new Date().getMonth() + 1))

export const getDay = () => Math.floor(Date.now() / MILLISECONDS_IN_DAY)

export const getCurrentCount = () => new Date().getDay() + 1

export const getBeforeFirstVisibleDay = () =>
	getDay() - ActivityNode.PAST_COUNT - getCurrentCount()

export interface ActivityNodeData {
	day: number
	value: number
}

export default class ActivityNode {
	static readonly PAST_COUNT = 52 * 7
	static readonly observers = new Set<string>()

	day: number
	value: number
	date: Date

	constructor(data: ActivityNodeData) {
		this.day = data.day
		this.value = data.value
		this.date = new Date(this.day * MILLISECONDS_IN_DAY)
	}

	static fromSnapshot = (snapshot: SnapshotLike) =>
		new ActivityNode(ActivityNode.dataFromSnapshot(snapshot))

	static dataFromSnapshot = (snapshot: SnapshotLike): ActivityNodeData => ({
		day: snapshot.get('day') ?? 0,
		value: snapshot.get('value') ?? 0
	})

	static dataFromDay = (day: number): ActivityNodeData => ({ day, value: 0 })

	get intensity() {
		const { value } = this

		if (!value) return 0

		if (value <= 5) return 1
		if (value <= 10) return 2
		if (value <= 15) return 3
		if (value <= 20) return 4

		return 5
	}
}
