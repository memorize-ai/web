import React, { PropsWithChildren } from 'react'

export interface ButtonProps {
	className?: string
	loaderSize?: string
	loaderThickness?: string
	loaderColor?: string
	loading?: boolean
	disabled?: boolean
	onClick?: () => void
}

export default ({
	className,
	loaderSize,
	loaderThickness,
	loaderColor,
	loading,
	disabled,
	onClick,
	children
}: PropsWithChildren<ButtonProps>) => (
	<button className={className} disabled={disabled || loading} onClick={onClick}>
		{loading
			? (
				<div
					className="loader"
					style={{
						width: loaderSize,
						height: loaderSize,
						border: `${loaderThickness} solid transparent`,
						borderTop: `${loaderThickness} solid ${loaderColor}`,
						borderRight: `${loaderThickness} solid ${loaderColor}`
					}}
				/>
			)
			: children
		}
	</button>
)
