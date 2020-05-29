import React, { HTMLAttributes } from 'react'

export enum LogoType {
	Icon = 'icon.webp',
	Capital = 'capital.webp',
	CapitalInverted = 'capital-inverted.webp',
	CapitalInvertedGrayscale = 'capital-inverted-grayscale.webp'
}

export default ({ type, ...props }: { type: LogoType } & HTMLAttributes<HTMLImageElement>) => (
	<img {...props} src={require(`../../images/logos/${type}`)} alt="Logo" />
)
