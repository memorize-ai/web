import React, { PropsWithChildren, HTMLAttributes } from 'react'

import Loader from './Loader'

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
		{loading && loaderSize && loaderThickness && loaderColor
			? (
				<Loader
					size={loaderSize}
					thickness={loaderThickness}
					color={loaderColor}
				/>
			)
			: children
		}
	</button>
)
