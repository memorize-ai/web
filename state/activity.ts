import { atom } from 'recoil'

import ActivityNode from 'models/ActivityNode'

export type ActivityState = Record<number, ActivityNode>

const activityState = atom<ActivityState>({
	key: 'activity',
	default: {}
})

export default activityState
