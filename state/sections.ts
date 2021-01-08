import { atomFamily } from 'recoil'

import Section from 'models/Section'

export type SectionsState = Section[] | null

const sectionsState = atomFamily<SectionsState, string | undefined>({
	key: 'sections',
	default: null,
	dangerouslyAllowMutability: true
})

export default sectionsState
