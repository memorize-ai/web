import { atomFamily } from 'recoil'

import User from 'models/User'

export type CreatorsState = User | null

const creatorsState = atomFamily<CreatorsState, string>({
	key: 'creators',
	default: null,
	dangerouslyAllowMutability: true
})

export default creatorsState
