import React, { HTMLAttributes } from 'react'

export interface BoxProps {
	image: string
	title: string
	description: string
}

export default ({ image, title, description, ...props }: BoxProps & HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className="z-10 text-dark-gray bg-white shadow-sm raise-on-hover">
		<img src={image} alt={title} />
		<h1 className="mt-4">{title}</h1>
		<p className="mt-2">{description}</p>
	</div>
)
