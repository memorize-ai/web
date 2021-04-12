import { CSSProperties, useEffect } from 'react'
import Head from 'next/head'
import cx from 'classnames'

import { DEV } from 'lib/constants'

const AD_CLIENT = process.env.NEXT_PUBLIC_AD_CLIENT
if (!AD_CLIENT) throw new Error('Missing ad client')

const DEV_STYLE: CSSProperties = {
	maxWidth: 1200,
	background: 'white'
}

interface AdKey {
	adsbygoogle?: Record<string, never>[]
}

export interface AdProps {
	className?: string
	format: string
	layout: string
	slot: string
}

const Ad = ({ className, format, layout, slot }: AdProps) => {
	useEffect(() => {
		;(((window as unknown) as AdKey).adsbygoogle ||= []).push({})
	}, [])

	return (
		<>
			<Head>
				<script
					key="ad"
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
					async
				/>
			</Head>
			<ins
				className={cx('adsbygoogle', className)}
				style={DEV ? DEV_STYLE : undefined}
				data-ad-format={format}
				data-ad-layout-key={layout}
				data-ad-client={AD_CLIENT}
				data-ad-slot={slot}
			/>
		</>
	)
}

export default Ad
