import React from 'react'
import Helmet from 'react-helmet'
import Schema, { Thing } from 'schema.org-react'

export interface HeadProps<SchemaItems extends Thing[]> {
	canonical?: string
	ogUrl?: string
	ogType?: string
	title: string
	ogTitle?: string
	twitterTitle?: string
	description: string
	ogDescription?: string
	twitterDescription?: string
	ogImage?: string
	twitterImage?: string
	schemaItems: SchemaItems
}

export const LOGO_URL = 'https://memorize.ai/square.png'
export const APP_STORE_DESCRIPTION = 'Do less. Learn more. Download on the app store for free, and change your life today.'

export default <SchemaItems extends Thing[]>({
	canonical: _canonical,
	ogUrl,
	ogType,
	title,
	ogTitle: _ogTitle,
	twitterTitle,
	description,
	ogDescription: _ogDescription,
	twitterDescription,
	ogImage: _ogImage,
	twitterImage,
	schemaItems
}: HeadProps<SchemaItems>) => {
	const canonical = _canonical ?? window.location.href
	
	const ogTitle = _ogTitle ?? title
	const ogDescription = _ogDescription ?? description
	const ogImage = _ogImage ?? LOGO_URL
	
	return (
		<>
			<Helmet>
				<meta name="description" content={description} />
				
				<meta property="og:url" content={ogUrl ?? canonical} />
				<meta property="og:site_name" content="memorize.ai" />
				<meta property="og:type" content={ogType ?? 'website'} />
				<meta property="og:title" content={ogTitle} />
				<meta property="og:description" content={ogDescription ?? description} />
				<meta property="og:image" content={ogImage} />
				
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:site" content="@memorize_ai" />
				<meta name="twitter:title" content={twitterTitle ?? ogTitle} />
				<meta name="twitter:description" content={twitterDescription ?? ogDescription} />
				<meta name="twitter:image" content={twitterImage ?? ogImage} />
				
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
					{
						'@type': 'Organization',
						url: 'https://memorize.ai',
						logo: LOGO_URL,
						sameAs: [
							'https://twitter.com/memorize_ai'
						]
					},
					...schemaItems
				]
			} as any} />
		</>
	)
}

export * from 'schema.org-react'
