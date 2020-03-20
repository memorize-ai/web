import React, { HTMLAttributes } from 'react'
import cx from 'classnames'

import '../../scss/components/TextArea.scss'

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
		className={cx('textarea', className)}
		style={{ minHeight }}
		placeholder={placeholder}
		value={value}
		onChange={({ target: { value } }) => setValue(value)}
	/>
)
