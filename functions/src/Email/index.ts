import { EMAIL_SENDER } from '../constants'

export enum EmailTemplate {
	DueCards = 'due-cards'
}

export default class Email {
	static send = (
		{ template, to, subject, context }: {
			template: EmailTemplate
			to: string
			subject: string
			context?: Record<string, any>
		}
	) =>
		EMAIL_SENDER.sendMjml({
			to,
			subject,
			path: `/srv/emails/${template}.mjml`,
			context
		})
}
