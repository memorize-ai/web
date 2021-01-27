import { ParsedUrlQuery } from 'querystring'

import UserData from 'models/User/Data'

export interface ReportMessageQuery extends ParsedUrlQuery {
	fromId: string
	toId: string
	messageId: string
}

export interface ReportMessageProps {
	from: UserData
}
