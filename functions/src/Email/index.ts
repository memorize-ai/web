import * as sendgrid from '@sendgrid/mail'

import { SENDGRID_API_KEY } from '../constants'

sendgrid.setApiKey(SENDGRID_API_KEY)

export enum EmailTemplate {
	DueCardsNotification = 'due-cards'
}

export interface EmailUser {
	name: string
	email: string
}

export interface EmailOptions {
	template: EmailTemplate
	to: EmailUser
	from?: EmailUser
	subject: string
	context?: Record<string, any>
}

export const DEFAULT_FROM: EmailUser = {
	name: 'memorize.ai',
	email: 'support@memorize.ai'
}

export const getTemplateId = (template: EmailTemplate) => {
	switch (template) {
		case EmailTemplate.DueCardsNotification:
			return 'd-8d3445ce4d31446faf1a8dfc19b2824f'
	}
}

export const emailOptionsToMessage = ({
	template,
	to,
	from = DEFAULT_FROM,
	subject,
	context
}: EmailOptions): sendgrid.MailDataRequired => ({
	templateId: getTemplateId(template),
	to,
	from,
	subject,
	dynamicTemplateData: context
})

export const sendEmail = (options: EmailOptions | EmailOptions[]) =>
	sendgrid.send(
		(Array.isArray(options)
			? options.map(emailOptionsToMessage)
			: emailOptionsToMessage(options)
		) as any
	)
