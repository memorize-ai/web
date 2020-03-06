import React, { PropsWithChildren, HTMLAttributes } from 'react'

export interface ButtonProps {
	loaderSize?: string
	loaderThickness?: string
	loaderColor?: string
	loading?: boolean
	disabled?: boolean
	onClick?: () => void
}

export default ({
	loaderSize,
	loaderThickness,
	loaderColor,
	loading,
	disabled,
	onClick,
	children,
	...props
}: PropsWithChildren<ButtonProps & HTMLAttributes<HTMLButtonElement>>) => (
	<button {...props} disabled={disabled || loading} onClick={onClick}>
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
