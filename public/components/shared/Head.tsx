import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Thing, MobileApplication } from 'schema-dts'

import { APP_SCREENSHOT_URL, APP_STORE_URL } from 'lib/constants'

export interface Label {
	name: string
	value: string
}

export interface Breadcrumb {
	name: string
	url: string
}

export interface HeadProps<SchemaItems extends Thing[]> {
	isPrerenderReady?: boolean
	status?: number
	canonicalUrl?: string
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

export const LOGO_URL = 'https://memorize.ai/images/logos/square.png'
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

const entities = {
	'&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;'
}

const replacer = (_: string, value: any) => {
	switch (typeof value) {
		case 'object':
			return value === null ? undefined : value
		case 'number':
		case 'boolean':
		case 'bigint':
			return value
		case 'string':
			return value.replace(/[&<>'"]/g, v => entities[v] ?? v)
		default:
			return undefined
	}
}

export default <SchemaItems extends Thing[]>({
	isPrerenderReady = true,
	status,
	canonicalUrl: _canonicalUrl,
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
	const router = useRouter()
	
	const canonicalUrl = _canonicalUrl ?? `https://memorize.ai${router.asPath}`
	
	const ogUrl = _ogUrl ?? canonicalUrl
	const ogTitle = _ogTitle ?? title
	const ogDescription = _ogDescription ?? description
	const ogImage = _ogImage ?? LOGO_URL
	
	useEffect(() => {
		if (process.browser)
			(window as any).prerenderReady = isPrerenderReady
	}, [isPrerenderReady])
	
	return (
		<Head>
			{status && (
				<meta
					key="meta-prerender-status-code"
					name="prerender-status-code"
					content={status.toString()}
				/>
			)}
			
			<meta key="meta-description" name="description" content={description} />
			
			<meta key="meta-og-url" property="og:url" content={ogUrl} />
			<meta key="meta-og-site-name" property="og:site_name" content="memorize.ai" />
			<meta key="meta-og-type" property="og:type" content={ogType ?? 'website'} />
			<meta key="meta-og-title" property="og:title" content={ogTitle} />
			<meta key="meta-og-description" property="og:description" content={ogDescription} />
			<meta key="meta-og-image" property="og:image" content={ogImage} />
			
			<meta key="meta-twitter-card" name="twitter:card" content="summary_large_image" />
			<meta key="meta-twitter-site" name="twitter:site" content="@memorize_ai" />
			<meta key="meta-twitter-creator" name="twitter:creator" content="@memorize_ai" />
			<meta key="meta-twitter-domain" name="twitter:domain" content="memorize.ai" />
			<meta key="meta-twitter-url" name="twitter:url" content={twitterUrl ?? ogUrl} />
			<meta key="meta-twitter-title" name="twitter:title" content={twitterTitle ?? ogTitle} />
			<meta key="meta-twitter-description" name="twitter:description" content={twitterDescription ?? ogDescription} />
			<meta key="meta-twitter-image" name="twitter:image" content={twitterImage ?? ogImage} />
			
			{labels?.map(({ name }, i) => (
				<meta key={`twitter:label${name}`} name={`twitter:label${i + 1}`} content={name} />
			))}
			
			{labels?.map(({ name, value }, i) => (
				<meta key={`twitter:data${name}`} name={`twitter:data${i + 1}`} content={value} />
			))}
			
			<link key="link-canonical" rel="canonical" href={canonicalUrl} />
			
			<title key="title">{title}</title>
			
			<script
				key="script-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
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
					}, replacer)
				}}
			/>
		</Head>
	)
}

export * from 'schema-dts'
