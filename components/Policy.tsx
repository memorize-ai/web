import { PropsWithChildren } from 'react'

import Head from './Head'

const Policy = (
	{ url, title, description, children }: PropsWithChildren<{
		url?: string
		description: string
		title: string
	}>
) => (
	<div className="policy">
		<Head
			url={url}
			title={`${title} | memorize.ai`}
			description={description}
			breadcrumbs={url => [
				[{ name: title, url }]
			]}
			schema={[
				{
					'@type': 'Article',
					headline: title,
					name: title,
					description
				}
			]}
		/>
		<h1 className="title">{title}</h1>
		<hr />
		{children}
	</div>
)

export default Policy
