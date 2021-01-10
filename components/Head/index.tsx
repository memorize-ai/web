import { Fragment, useMemo } from 'react'
import { useRouter } from 'next/router'
import NextHead from 'next/head'

import { BASE_URL, APP_STORE_URL } from 'lib/constants'
import { src as screenshot } from 'images/screenshots/review.jpg'

import { src as DEFAULT_OG_IMAGE } from 'images/logos/large.png'
export { DEFAULT_OG_IMAGE }

export interface Label {
	name: string
	value: string
}

export interface Breadcrumb {
	name: string
	url: string
}

export interface HeadProps {
	url?: string
	title: string
	description?: string
	image?: string
	labels?: Label[]
	breadcrumbs(url: string): Breadcrumb[][]
	schema?: Record<string, unknown>[]
}

export const DEFAULT_DESCRIPTION =
	'Tired of long study sessions? We use artificial intelligence to accurately predict when you need to review. Welcome to efficient and effective memorization.'

export const APP_SCHEMA = {
	'@type': 'MobileApplication',
	name: 'memorize.ai',
	operatingSystem: 'iOS',
	softwareVersion: '3.1.6',
	screenshot,
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

const Head = ({
	url: initialPath,
	title,
	description = DEFAULT_DESCRIPTION,
	image = DEFAULT_OG_IMAGE,
	labels = [],
	breadcrumbs,
	schema = []
}: HeadProps) => {
	const fallbackPath = useRouter().asPath
	const untrimmedPath = initialPath ?? fallbackPath
	const path = untrimmedPath === '/' ? '' : untrimmedPath
	const url = `${BASE_URL}${path}`

	const data = useMemo(
		() => ({
			__html: JSON.stringify({
				'@context': 'https://schema.org',
				'@graph': [
					{
						'@type': 'WebSite',
						url: BASE_URL,
						name: 'memorize.ai',
						description: DEFAULT_DESCRIPTION,
						potentialAction: [
							{
								'@type': 'SearchAction',
								target: `${BASE_URL}/market?q={search_term_string}`,
								'query-input': 'required name=search_term_string'
							}
						],
						inLanguage: 'en-US'
					},
					{
						'@type': 'Organization',
						url: BASE_URL,
						logo: DEFAULT_OG_IMAGE,
						sameAs: ['https://twitter.com/memorize_ai']
					},
					...breadcrumbs(path).map(list => ({
						'@type': 'BreadcrumbList',
						itemListElement: list.map(({ name, url }, i) => ({
							'@type': 'ListItem',
							position: i + 1,
							name,
							item: `${BASE_URL}${url}`
						}))
					})),
					...schema
				]
			})
		}),
		[path, breadcrumbs, schema]
	)

	return (
		<NextHead>
			<title key="title">{title}</title>
			<link key="canonical" rel="canonical" href={url} />
			<meta key="description" name="description" content={description} />

			<meta key="og-url" property="og:url" content={url} />
			<meta key="og-site-name" property="og:site_name" content="memorize.ai" />
			<meta key="og-type" property="og:type" content="website" />
			<meta key="og-title" property="og:title" content={title} />
			<meta
				key="og-description"
				property="og:description"
				content={description}
			/>
			<meta key="og-image" property="og:image" content={image} />

			<meta
				key="twitter-card"
				name="twitter:card"
				content="summary_large_image"
			/>
			<meta key="twitter-site" name="twitter:site" content="@memorize_ai" />
			<meta
				key="twitter-creator"
				name="twitter:creator"
				content="@memorize_ai"
			/>
			<meta key="twitter-domain" name="twitter:domain" content="memorize.ai" />
			<meta key="twitter-url" name="twitter:url" content={url} />
			<meta key="twitter-title" name="twitter:title" content={title} />
			<meta
				key="twitter-description"
				name="twitter:description"
				content={description}
			/>
			<meta key="twitter-image" name="twitter:image" content={image} />

			{labels.map(({ name, value }, i) => (
				<Fragment key={`twitter:label${name}${value}`}>
					<meta name={`twitter:label${i + 1}`} content={name} />
					<meta name={`twitter:data${i + 1}`} content={value} />
				</Fragment>
			))}

			<script
				key="data"
				type="application/ld+json"
				dangerouslySetInnerHTML={data}
			/>
		</NextHead>
	)
}

export default Head
