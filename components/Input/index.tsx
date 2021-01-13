import { forwardRef, InputHTMLAttributes } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import styles from './index.module.scss'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	className?: string
	inputClassName?: string
	iconClassName?: string
	required?: boolean
	icon?: IconDefinition
	type: string
	placeholder: string
	value: string
	setValue(value: string): void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			inputClassName,
			iconClassName,
			required,
			icon,
			type,
			placeholder,
			value,
			setValue,
			...props
		},
		ref
	) => (
		<div className={cx(styles.root, className)}>
			<input
				{...props}
				ref={ref}
				className={cx(styles.input, inputClassName)}
				required={required}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={({ target }) => setValue(target.value)}
			/>
			{icon && (
				<FontAwesomeIcon
					className={cx(styles.icon, iconClassName)}
					icon={icon}
				/>
			)}
		</div>
	)
)

export default Input
