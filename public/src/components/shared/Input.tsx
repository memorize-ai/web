import React, { HTMLAttributes } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

export interface InputProps {
	className?: string
	icon?: IconDefinition
	type: string
	placeholder: string
	value: string
	setValue: (value: string) => void
}

export default ({
	className,
	icon,
	type,
	placeholder,
	value,
	setValue,
	...props
}: InputProps & HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className={`input${className ? ` ${className}` : ''}`}>
		<input
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={({ target }) => setValue(target.value)}
		/>
		{icon && <FontAwesomeIcon icon={icon} />}
	</div>
)
