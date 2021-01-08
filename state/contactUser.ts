import { atomFamily } from 'recoil'

import LoadingState from 'models/LoadingState'

export type ContactUserState = LoadingState

const contactUserState = atomFamily<ContactUserState, string>({
	key: 'contactUser',
	default: LoadingState.Loading
})

export default contactUserState
