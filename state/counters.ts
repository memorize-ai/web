import { atomFamily } from 'recoil'

import { Counter } from 'models/Counters'

export type CountersState = number | null

const countersState = atomFamily<CountersState, Counter>({
	key: 'counters',
	default: null
})

export default countersState
