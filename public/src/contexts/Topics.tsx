import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'
import Topic from '../models/Topic'

export interface TopicsState {
	topics: Topic[]
	isObservingTopics: boolean
}

export type TopicsAction = Action<
	| boolean // SetIsObservingTopics
	| firebase.firestore.DocumentSnapshot // AddTopic, UpdateTopic
	| string // RemoveTopic
>

const initialState: TopicsState = {
	topics: [],
	isObservingTopics: false
}

const reducer = (state: TopicsState, { type, payload }: TopicsAction) => {
	switch (type) {
		case ActionType.SetIsObservingTopics:
			return { ...state, isObservingTopics: payload as boolean }
		case ActionType.AddTopic:
			return {
				...state,
				topics: [
					...state.topics,
					Topic.fromSnapshot(payload as firebase.firestore.DocumentSnapshot)
				].sort(({ name: a }, { name: b }) => a.localeCompare(b))
			}
		case ActionType.UpdateTopic: {
			const snapshot = payload as firebase.firestore.DocumentSnapshot
			
			return {
				...state,
				topics: state.topics
					.map(topic =>
						topic.id === snapshot.id
							? topic.updateFromSnapshot(snapshot)
							: topic
					)
					.sort(({ name: a }, { name: b }) => a.localeCompare(b))
			}
		}
		case ActionType.RemoveTopic: {
			const id = payload as string
			
			return {
				...state,
				topics: state.topics.filter(topic =>
					topic.id !== id
				)
			}
		}
		default:
			return state
	}
}

const Context = createContext<[TopicsState, Dispatch<TopicsAction>]>([initialState, console.log])
export default Context

export const TopicsProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
