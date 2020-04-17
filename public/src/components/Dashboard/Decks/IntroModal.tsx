import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import useQuery from '../../../hooks/useQuery'
import Modal from '../../shared/Modal'
import Screenshot, { ScreenshotType } from '../../shared/Screenshot'
import {APP_STORE_URL } from '../../../constants'

export default () => {
	const history = useHistory()
	
	const isNew = useQuery().get('new') === '1'
	const [isIntroModalShowing, setIsIntroModalShowing] = useState(isNew)
	
	useEffect(() => {
		if (isNew)
			history.replace(window.location.pathname)
	}, [isNew, history])
	
	return (
		<Modal
			className="deck-intro"
			isShowing={isIntroModalShowing}
			setIsShowing={setIsIntroModalShowing}
		>
			<div className="header">
				<h2 className="title">
					We're glad to have you.
				</h2>
				<button
					className="hide"
					onClick={() => setIsIntroModalShowing(false)}
				>
					<FontAwesomeIcon icon={faTimesCircle} />
				</button>
			</div>
			<div className="content">
				<p className="left">
					To start reviewing, you'll need to <a href={APP_STORE_URL}>download our app on the App Store</a>.
				</p>
				<a className="right" href="/#screenshots">
					<Screenshot type={ScreenshotType.Review} />
				</a>
			</div>
		</Modal>
	)
}
