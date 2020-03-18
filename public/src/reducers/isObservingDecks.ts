import Action, { ActionType } from '../actions/Action'

export default (value: boolean = false, { type, payload }: Action<boolean>) =>
	type === ActionType.SetIsObservingDecks
		? payload
		: value
