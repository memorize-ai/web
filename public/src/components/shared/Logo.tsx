import React, { HTMLAttributes } from 'react'

export enum LogoType {
	Icon = 'icon.png',
	Capital = 'capital.png',
	CapitalInverted = 'capital-inverted.png',
	CapitalInvertedGrayscale = 'capital-inverted-grayscale.png'
}

export default ({ type, ...props }: { type: LogoType } & HTMLAttributes<HTMLImageElement>) => (
	<img {...props} src={require(`../../images/logos/${type}`)} alt="Logo" />
)
