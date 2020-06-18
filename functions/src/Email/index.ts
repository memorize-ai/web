import * as sendgrid from '@sendgrid/mail'

import User from '../User'
import { SENDGRID_API_KEY } from '../constants'

sendgrid.setApiKey(SENDGRID_API_KEY)

export enum EmailTemplate {
	DueCardsNotification = 'due-cards'
}

export interface EmailFrom {
	name: string
	email: string
}

export interface SendEmailOptions {
	template: EmailTemplate
	to: User | User[]
	from?: EmailFrom
	subject: string
	context?: Record<string, any>
}

export const DEFAULT_FROM: EmailFrom = {
	name: 'memorize.ai',
	email: 'support@memorize.ai'
}

export const getTemplateId = (template: EmailTemplate) => {
	switch (template) {
		case EmailTemplate.DueCardsNotification:
			return 'd-8d3445ce4d31446faf1a8dfc19b2824f'
	}
}

export const sendEmail = ({
	template,
	to,
	from = DEFAULT_FROM,
	subject,
	context
}: SendEmailOptions) =>
	sendgrid.send({
		templateId: getTemplateId(template),
		bcc: to,
		from,
		subject,
		dynamicTemplateData: context
	})
