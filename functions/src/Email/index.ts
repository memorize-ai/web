// import sendgrid from '@sendgrid/mail'

export enum EmailTemplate {
	DueCardsNotification = 'due-cards'
}

export const idFromTemplate = (template: EmailTemplate) => {
	switch (template) {
		case EmailTemplate.DueCardsNotification:
			return 'd-8d3445ce4d31446faf1a8dfc19b2824f'
	}
}

// export default class Email {
// 	static send = (
// 		{ template, to, subject, context }: {
// 			template: EmailTemplate
// 			to: string
// 			subject: string
// 			context?: Record<string, any>
// 		}
// 	) =>
// 		EMAIL_SENDER.sendMjml({
// 			to,
// 			subject,
// 			path: `/srv/emails/${template}.mjml`,
// 			context
// 		})
// }
