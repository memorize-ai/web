import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import Section from 'models/Section'
import state from 'state/sections'
import firebase from 'lib/firebase'
import handleError from 'lib/handleError'

import 'firebase/firestore'

const firestore = firebase.firestore()

const useSections = (deckId: string | undefined) => {
	const [sections, setSections] = useRecoilState(state(deckId))
	const didLoad = Boolean(sections)

	useEffect(() => {
		if (!deckId || didLoad || Section.observers[deckId]) return

		Section.observers[deckId] = true

		firestore.collection(`decks/${deckId}/sections`).onSnapshot(snapshot => {
			const snapshots: firebase.firestore.DocumentSnapshot[] = []

			for (const { type, doc } of snapshot.docChanges())
				switch (type) {
					case 'added':
						snapshots.push(doc)
						break
					case 'modified':
						setSections(
							sections =>
								sections &&
								sections.map(section =>
									section.id === doc.id
										? section.updateFromSnapshot(doc)
										: section
								)
						)
						break
					case 'removed':
						setSections(
							sections => sections && sections.filter(({ id }) => id !== doc.id)
						)
						break
				}

			setSections(sections =>
				Section.sort([
					...(sections ?? []),
					...snapshots.map(Section.fromSnapshot)
				])
			)
		}, handleError)
	}, [deckId, didLoad, setSections])

	return sections
}

export default useSections
