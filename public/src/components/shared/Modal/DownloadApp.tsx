import React, { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import Modal from '.'
import AppStoreDownloadButton from '../AppStoreDownloadButton'

import '../../../scss/components/Modal/DownloadApp.scss'

const screenshots = [1, 2, 3, 4, 5, 6, 7].map(i =>
	require(`../../../images/screenshots/framed/${i}.webp`) as string
)

const DownloadAppModal = memo((
	{ message, isShowing, setIsShowing }: {
		message: string
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => (
	<Modal
		className="deck-intro"
		isLazy={true}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		<div className="header">
			<h2 className="title">
				The ultimate memorization app
			</h2>
			<button
				className="hide"
				onClick={() => setIsShowing(false)}
			>
				<FontAwesomeIcon icon={faTimesCircle} />
			</button>
		</div>
		<div className="content">
			<div className="left">
				<p className="message">{message}</p>
				<AppStoreDownloadButton className="download" />
				<a className="screenshots" href="/landing/#screenshots">
					Not convinced?
				</a>
			</div>
			<div className="right">
				{screenshots.map(src => (
					<img key={src} src={src} alt="Screenshot" />
				))}
			</div>
		</div>
	</Modal>
))

export default DownloadAppModal
