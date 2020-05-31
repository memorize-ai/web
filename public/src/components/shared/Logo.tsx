import React, { HTMLAttributes, memo } from 'react'

export enum LogoType {
	Icon = 'icon.webp',
	Capital = 'capital.webp',
	CapitalInverted = 'capital-inverted.webp',
	CapitalInvertedGrayscale = 'capital-inverted-grayscale.webp'
}

const Logo = ({ type, ...props }: { type: LogoType } & HTMLAttributes<HTMLImageElement>) => (
	<img {...props} src={require(`../../images/logos/${type}`)} alt="Logo" />
)

export default memo(Logo)
