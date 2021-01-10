import { ParsedUrlQuery } from 'querystring'

import { UserData } from 'models/User'

export interface BlockUserQuery extends ParsedUrlQuery {
	fromId: string
	toId: string
}

export interface BlockUserProps {
	from: UserData
}
