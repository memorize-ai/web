import React, { HTMLAttributes, memo } from 'react'

import WebP from './WebP'

export enum LogoType {
	Icon = 'icon',
	Capital = 'capital',
	CapitalInverted = 'capital-inverted',
	CapitalInvertedGrayscale = 'capital-inverted-grayscale'
}

const Logo = ({ type, ...props }: { type: LogoType } & HTMLAttributes<HTMLImageElement>) => (
	<WebP
		{...props}
		src={require(`../../images/logos/${type}.webp`)}
		fallback={require(`../../images/fallbacks/logos/${type}.jpg`)}
		alt="Logo"
	/>
)

export default Logo
