import { atom } from 'recoil'

import User from 'models/User'
import LoadingState from 'models/LoadingState'

export interface CurrentUserState {
	value: User | null
	loadingState: LoadingState
	isObserving: boolean
}

const currentUserState = atom<CurrentUserState>({
	key: 'currentUser',
	default: {
		value: null,
		loadingState: LoadingState.None,
		isObserving: false
	},
	dangerouslyAllowMutability: true
})

export default currentUserState
