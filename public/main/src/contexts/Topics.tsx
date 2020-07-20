import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'
import Topic from '../models/Topic'

export type TopicsAction = Action<
	| boolean // SetIsObservingTopics
	| firebase.firestore.DocumentSnapshot[] // AddTopics
	| firebase.firestore.DocumentSnapshot // UpdateTopic
	| string // RemoveTopic
>

const reducer = (topics: Topic[] | null, { type, payload }: TopicsAction) => {
	switch (type) {
		case ActionType.AddTopics:
			return [
				...(topics ?? []),
				...(payload as firebase.firestore.DocumentSnapshot[]).map(Topic.fromSnapshot)
			].sort(({ name: a }, { name: b }) => a.localeCompare(b))
		case ActionType.UpdateTopic: {
			const snapshot = payload as firebase.firestore.DocumentSnapshot
			
			return topics && topics
				.map(topic =>
					topic.id === snapshot.id
						? topic.updateFromSnapshot(snapshot)
						: topic
				)
				.sort(({ name: a }, { name: b }) => a.localeCompare(b))
		}
		case ActionType.RemoveTopic: {
			const id = payload as string
			
			return topics && topics.filter(topic => topic.id !== id)
		}
		default:
			return topics
	}
}

const Context = createContext<[Topic[] | null, Dispatch<TopicsAction>]>([null, console.log])
export default Context

export const TopicsProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, null)}>
		{children}
	</Context.Provider>
)
