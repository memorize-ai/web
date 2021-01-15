import { atom } from 'recoil'

type NewUserImageUrlState = string | null | undefined

const newUserImageUrlState = atom<NewUserImageUrlState>({
	key: 'newUserImageUrl',
	default: undefined
})

export default newUserImageUrlState
