import { ParsedUrlQuery } from 'querystring'

import { UserData } from 'models/User'

export interface UserPageQuery extends ParsedUrlQuery {
	slugId: string
	slug: string
}

export interface UserPageProps {
	user: UserData
}

export interface UserPagePath {
	params: UserPageQuery
}
