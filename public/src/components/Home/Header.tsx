import React, { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'

import AuthButton from '../shared/AuthButton'
import Screenshot, { ScreenshotType } from '../shared/Screenshot'
import { APP_STORE_URL } from '../../constants'

import { ReactComponent as LeftArrow } from '../../images/icons/left-arrow.svg'

import '../../scss/components/Home/Header.scss'

const HomeHeader = () => (
	<div className="header">
		<div className="left">
			<h1>
				Do less.<br />
				Learn more.
			</h1>
			<h3>Truly effective AI flashcards</h3>
			<div className="footer">
				<AuthButton className="join-button">
					<p>Get started</p>
					<LeftArrow />
				</AuthButton>
				<a href={APP_STORE_URL} className="app-store">
					<FontAwesomeIcon icon={faApple} />
					<p>Download</p>
				</a>
			</div>
		</div>
		<Screenshot type={ScreenshotType.Cram} className="screenshot" />
	</div>
)

export default memo(HomeHeader)
