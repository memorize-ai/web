import React from 'react'
import Link, { LinkProps } from 'next/link'
import cx from 'classnames'

import LeftArrowHead from 'images/icons/left-arrow-head.svg'

import '../../scss/components/BackButton.scss'

export default ({ className, ...props }: { className?: string } & LinkProps) => (
	<Link {...props}>
		<a className={cx('back-button', className)}>
			<LeftArrowHead />
			<p>Back</p>
		</a>
	</Link>
)
