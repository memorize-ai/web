import React from 'react'
import Helmet from 'react-helmet'
import Schema, { Thing } from 'schema.org-react'

export interface HeadProps<SchemaItems extends Thing[]> {
	canonical?: string
	ogUrl?: string
	ogType?: string
	title: string
	ogTitle?: string
	description: string
	ogDescription?: string
	ogImage: string
	schemaItems: SchemaItems
}

export default <SchemaItems extends Thing[]>({
	canonical: _canonical,
	ogUrl,
	ogType,
	title,
	ogTitle,
	description,
	ogDescription,
	ogImage,
	schemaItems
}: HeadProps<SchemaItems>) => {
	const canonical = _canonical ?? window.location.href
	
	return (
		<>
			<Helmet>
				<meta name="description" content={description} />
				<meta property="og:url" content={ogUrl ?? canonical} />
				<meta property="og:site_name" content="memorize.ai" />
				<meta property="og:type" content={ogType ?? 'website'} />
				<meta property="og:title" content={ogTitle ?? title} />
				<meta property="og:description" content={ogDescription ?? description} />
				<meta property="og:image" content={ogImage} />
				<link rel="canonical" href={canonical} />
				<title>{title}</title>
			</Helmet>
			<Schema item={{
				'@context': 'https://schema.org',
				'@graph': [
					{
						'@type': 'WebSite',
						url: 'https://memorize.ai',
						name: 'memorize.ai',
						description: 'Do less. Learn more. Download on the app store for free, and change your life today.',
						potentialAction: [
							{
								'@type': 'SearchAction',
								target: 'https://memorize.ai/market?q={search_term_string}',
								'query-input': 'required name=search_term_string'
							}
						],
						inLanguage: 'en-US'
					},
					...schemaItems
				]
			} as any} />
		</>
	)
}

export * from 'schema.org-react'
