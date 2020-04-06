import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'
import Topic from '../models/Topic'

export type TopicsAction = Action<
	| boolean // SetIsObservingTopics
	| firebase.firestore.DocumentSnapshot // AddTopic, UpdateTopic
	| string // RemoveTopic
>

const reducer = (topics: Topic[], { type, payload }: TopicsAction) => {
	switch (type) {
		case ActionType.AddTopic:
			return [
				...topics,
				Topic.fromSnapshot(payload as firebase.firestore.DocumentSnapshot)
			].sort(({ name: a }, { name: b }) => a.localeCompare(b))
		case ActionType.UpdateTopic: {
			const snapshot = payload as firebase.firestore.DocumentSnapshot
			
			return topics
				.map(topic =>
					topic.id === snapshot.id
						? topic.updateFromSnapshot(snapshot)
						: topic
				)
				.sort(({ name: a }, { name: b }) => a.localeCompare(b))
		}
		case ActionType.RemoveTopic: {
			const id = payload as string
			
			return topics.filter(topic => topic.id !== id)
		}
		default:
			return topics
	}
}

const Context = createContext<[Topic[], Dispatch<TopicsAction>]>([[], console.log])
export default Context

export const TopicsProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, [])}>
		{children}
	</Context.Provider>
)
