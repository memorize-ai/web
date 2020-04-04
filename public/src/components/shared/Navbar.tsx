import React, { HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import Logo, { LogoType } from './Logo'

import '../../scss/components/Navbar.scss'

export default ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className={cx('navbar', className)}>
		<Link to="/">
			<Logo type={LogoType.Capital} className="logo" />
		</Link>
		<div className="items">{children}</div>
	</div>
)
