import React, { HTMLAttributes } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import '../../scss/components/Input.scss'

export interface InputProps {
	className?: string
	required?: boolean
	icon?: IconDefinition
	type: string
	placeholder: string
	value: string
	setValue: (value: string) => void
}

export default ({
	className,
	required,
	icon,
	type,
	placeholder,
	value,
	setValue,
	...props
}: InputProps & HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className={cx('input', className)}>
		<input
			required={required}
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={({ target }) => setValue(target.value)}
		/>
		{icon && <FontAwesomeIcon icon={icon} />}
	</div>
)
