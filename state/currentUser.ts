import { atom } from 'recoil'

import User from 'models/User'
import LoadingState from 'models/LoadingState'

export interface CurrentUserState {
	value: User | null
	loadingState: LoadingState
}

const currentUserState = atom<CurrentUserState>({
	key: 'currentUser',
	default: {
		value: null,
		loadingState: LoadingState.Loading
	},
	dangerouslyAllowMutability: true
})

export default currentUserState
