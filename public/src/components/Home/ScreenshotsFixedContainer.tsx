import React, { PropsWithChildren } from 'react'

export default (
	{ outerClassName, anchor, children }: PropsWithChildren<{
		outerClassName?: string
		anchor: string
	}>
) => (
	<div className={`
		${outerClassName}
		fixed-container
		fixed
		inset-0
		pointer-events-none
	`}>
		<div
			className="center-container grid justify-center content-center h-screen"
			data-aos="fade-right"
			data-aos-anchor={anchor}
			data-aos-anchor-placement="top-top"
		>
			{children}
		</div>
	</div>
)
