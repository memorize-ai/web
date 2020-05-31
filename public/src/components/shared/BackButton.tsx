import React, { AnchorHTMLAttributes, memo } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import { ReactComponent as LeftArrowHead } from '../../images/icons/left-arrow-head.svg'

import '../../scss/components/BackButton.scss'

const BackButton = memo(({ to, className, ...props }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
	<Link {...props} to={to} className={cx('back-button', className)}>
		<LeftArrowHead />
		<p>Back</p>
	</Link>
))

export default BackButton
