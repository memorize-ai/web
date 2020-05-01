import React from 'react'
import Helmet from 'react-helmet'
import Schema, { Thing, MobileApplication } from 'schema.org-react'

import { APP_SCREENSHOT_URL, APP_STORE_URL } from '../../constants'

export interface Label {
	name: string
	value: string
}

export interface Breadcrumb {
	name: string
	url: string
}

export interface HeadProps<SchemaItems extends Thing[]> {
	canonical?: string
	ogUrl?: string
	twitterUrl?: string
	ogType?: string
	title: string
	ogTitle?: string
	twitterTitle?: string
	description: string
	ogDescription?: string
	twitterDescription?: string
	ogImage?: string
	twitterImage?: string
	labels?: Label[]
	breadcrumbs: Breadcrumb[][]
	schemaItems?: SchemaItems
}

export const LOGO_URL = 'https://memorize.ai/square.png'
export const APP_DESCRIPTION = 'Do less. Learn more. Download on the app store for free, and change your life today.'

export const APP_SCHEMA: MobileApplication = {
	'@type': 'MobileApplication',
	name: 'memorize.ai',
	operatingSystem: 'iOS',
	softwareVersion: '3.1.6',
	screenshot: APP_SCREENSHOT_URL,
	downloadUrl: APP_STORE_URL,
	installUrl: APP_STORE_URL,
	author: 'memorize.ai',
	aggregateRating: {
		'@type': 'AggregateRating',
		ratingValue: 5,
		ratingCount: 1,
		bestRating: 5,
		worstRating: 5
	},
	applicationCategory: 'Education',
	offers: {
		'@type': 'Offer',
		price: 0,
		priceCurrency: 'USD',
		seller: 'memorize.ai'
	}
}

export default <SchemaItems extends Thing[]>({
	canonical: _canonical,
	ogUrl: _ogUrl,
	twitterUrl,
	ogType,
	title,
	ogTitle: _ogTitle,
	twitterTitle,
	description,
	ogDescription: _ogDescription,
	twitterDescription,
	ogImage: _ogImage,
	twitterImage,
	labels,
	breadcrumbs,
	schemaItems
}: HeadProps<SchemaItems>) => {
	const canonical = _canonical ?? window.location.href
	
	const ogUrl = _ogUrl ?? canonical
	const ogTitle = _ogTitle ?? title
	const ogDescription = _ogDescription ?? description
	const ogImage = _ogImage ?? LOGO_URL
	
	return (
		<>
			<Helmet>
				<meta name="description" content={description} />
				
				<meta property="og:url" content={ogUrl} />
				<meta property="og:site_name" content="memorize.ai" />
				<meta property="og:type" content={ogType ?? 'website'} />
				<meta property="og:title" content={ogTitle} />
				<meta property="og:description" content={ogDescription} />
				<meta property="og:image" content={ogImage} />
				
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@memorize_ai" />
				<meta name="twitter:creator" content="@memorize_ai" />
				<meta name="twitter:domain" content="memorize.ai" />
				<meta name="twitter:url" content={twitterUrl ?? ogUrl} />
				<meta name="twitter:title" content={twitterTitle ?? ogTitle} />
				<meta name="twitter:description" content={twitterDescription ?? ogDescription} />
				<meta name="twitter:image" content={twitterImage ?? ogImage} />
				
				{labels?.map(({ name, value }, i) => (
					<>
						<meta name={`twitter:label${i}`} content={name} />
						<meta name={`twitter:data${i}`} content={value} />
					</>
				))}
				
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
						description: APP_DESCRIPTION,
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
					...breadcrumbs.map(list => ({
						'@type': 'BreadcrumbList',
						itemListElement: list.map(({ name, url }, i) => ({
							'@type': 'ListItem',
							position: i + 1,
							name,
							item: url
						}))
					})),
					...(schemaItems ?? [])
				]
			} as any} />
		</>
	)
}

export * from 'schema.org-react'
