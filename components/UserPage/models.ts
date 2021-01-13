import { ParsedUrlQuery } from 'querystring'

import { UserData } from 'models/User'

export interface UserPageQuery extends ParsedUrlQuery {
	slug: string
}

export interface UserPageProps {
	user: UserData
}
