import React, { forwardRef, InputHTMLAttributes, memo, Ref } from 'react'
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

const Input = (
	{ className, required, icon, type, placeholder, value, setValue, ...props }: InputProps & InputHTMLAttributes<HTMLInputElement>,
	ref: Ref<HTMLInputElement>
) => (
	<div className={cx('input', className)}>
		<input
			{...props}
			ref={ref}
			required={required}
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={({ target }) => setValue(target.value)}
		/>
		{icon && <FontAwesomeIcon icon={icon} />}
	</div>
)

export default forwardRef(Input)
