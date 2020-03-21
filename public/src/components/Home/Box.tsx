import React, { HTMLAttributes } from 'react'

export interface BoxProps {
	image: string
	title: string
	description: string
	index: number
}

export default ({ image, title, description, index, ...props }: BoxProps & HTMLAttributes<HTMLDivElement>) => (
	<div
		{...props}
		className="home box"
		data-aos="flip-up"
		data-aos-anchor="#home-boxes-aos-anchor"
		data-aos-delay={index * 100}
	>
		<img src={image} alt={title} />
		<h1>{title}</h1>
		<p>{description}</p>
	</div>
)
