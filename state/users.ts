import { atomFamily } from 'recoil'

import User from 'models/User'

export type UsersState = User | null

const usersState = atomFamily<UsersState, string>({
	key: 'users',
	default: null,
	dangerouslyAllowMutability: true
})

export default usersState
