import { atom } from 'recoil'

export type IntroModalIsShowingState = boolean

const introModalIsShowingState = atom<IntroModalIsShowingState>({
	key: 'introModalIsShowing',
	default: true
})

export default introModalIsShowingState
