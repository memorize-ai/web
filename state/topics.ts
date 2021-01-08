import { atom } from 'recoil'

import Topic from 'models/Topic'

export type TopicsState = Topic[] | null

const topicsState = atom<TopicsState>({
	key: 'topics',
	default: null,
	dangerouslyAllowMutability: true
})

export default topicsState
