import React, { PropsWithChildren } from 'react'
import cx from 'classnames'

import Loader from './Loader'

export interface ButtonProps {
	loaderSize?: string
	loaderThickness?: string
	loaderColor?: string
	loading?: boolean
	disabled?: boolean
}

const Button = ({
	className,
	loaderSize,
	loaderThickness,
	loaderColor,
	loading,
	disabled,
	onClick,
	children,
	...props
}: PropsWithChildren<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
	<button
		{...props}
		className={cx(className, { loading, disabled })}
		disabled={disabled || loading}
		onClick={onClick}
	>
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

export default Button
