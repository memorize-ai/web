import React, { HTMLAttributes } from 'react'

export default (
	{ className, minHeight, placeholder, value, setValue, ...props }: {
		className?: string
		minHeight?: string | number
		placeholder?: string
		value: string
		setValue: (value: string) => void
	} & HTMLAttributes<HTMLTextAreaElement>
) => (
	<textarea
		{...props}
		className={`textarea${className ? ` ${className}` : ''}`}
		style={{ minHeight }}
		placeholder={placeholder}
		value={value}
		onChange={({ target: { value } }) => setValue(value)}
	/>
)
