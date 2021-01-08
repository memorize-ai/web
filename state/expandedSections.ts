import { atom } from 'recoil'

export type ExpandedSectionsEntry = Record<string, Record<string, boolean>>

export interface ExpandedSectionsState {
	decks: ExpandedSectionsEntry
	ownedDecks: ExpandedSectionsEntry
}

const expandedSectionsState = atom<ExpandedSectionsState>({
	key: 'expandedSections',
	default: { decks: {}, ownedDecks: {} }
})

export default expandedSectionsState
