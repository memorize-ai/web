import { atomFamily } from 'recoil'

import ActivityNode from 'models/ActivityNode'

export type ActivityState = Record<number, ActivityNode>

const activityState = atomFamily<ActivityState, string | null>({
	key: 'activity',
	default: {}
})

export default activityState
