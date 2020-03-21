import React from 'react'

import TopGradient from './TopGradient'
import Navbar from './Navbar'
import AuthBox, { AuthBoxProps } from '../shared/AuthBox'

import '../../scss/components/Auth.scss'

export default (props: AuthBoxProps) => (
	<div className="auth">
		<TopGradient>
			<Navbar />
			<div className="auth-container">
				<AuthBox {...props} />
			</div>
		</TopGradient>
	</div>
)
