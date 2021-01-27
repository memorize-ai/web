import { GetServerSideProps } from 'next'

import { ReportMessageQuery, ReportMessageProps } from './models'
import users from 'lib/cache/users'
import messages from 'lib/cache/messages'

export const getServerSideProps: GetServerSideProps<
	ReportMessageProps,
	ReportMessageQuery
> = async ({ params }) => {
	if (!params) return { notFound: true }
	const { fromId, toId, messageId } = params

	if (fromId === toId)
		return {
			redirect: { permanent: true, destination: '/' }
		}

	const [from, to, message] = await Promise.all([
		users.get(fromId),
		users.get(toId),
		messages.get(messageId)
	])

	if (!(from && to && message)) return { notFound: true }

	if (!(message.from === from.id && message.to === to.id))
		return {
			redirect: { permanent: true, destination: '/' }
		}

	return {
		props: { from }
	}
}
