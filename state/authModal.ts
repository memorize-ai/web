import { atom } from 'recoil'

import User from 'models/User'
import AuthenticationMode from 'models/AuthenticationMode'

export interface AuthModalState {
	isShowing: boolean
	callback: ((user: User) => void) | null
	mode: AuthenticationMode
	initialXp: number
}

const authModalState = atom<AuthModalState>({
	key: 'authModal',
	default: {
		isShowing: false,
		callback: null,
		mode: AuthenticationMode.LogIn,
		initialXp: 0
	}
})

export default authModalState
