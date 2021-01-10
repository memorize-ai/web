import { ButtonHTMLAttributes, ReactNode } from 'react'
import cx from 'classnames'

import Loader from '../Loader'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loadingClassName?: string
	disabledClassName?: string
	loaderSize?: string
	loaderThickness?: string
	loaderColor?: string
	loading?: boolean
	disabled?: boolean
	children?: ReactNode
}

const Button = ({
	className,
	loadingClassName,
	disabledClassName,
	loaderSize,
	loaderThickness,
	loaderColor,
	loading,
	disabled,
	onClick,
	children,
	...props
}: ButtonProps) => (
	<button
		{...props}
		className={cx(
			className,
			loading && loadingClassName,
			disabled && disabledClassName
		)}
		disabled={disabled || loading}
		onClick={onClick}
	>
		{loading && loaderSize && loaderThickness && loaderColor ? (
			<Loader
				size={loaderSize}
				thickness={loaderThickness}
				color={loaderColor}
			/>
		) : (
			children
		)}
	</button>
)

export default Button
