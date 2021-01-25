import { useCallback } from 'react'
import Router from 'next/router'
import { useRecoilState } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import introModalIsShowingState from 'state/introModalIsShowing'
import Modal from '..'
import Notifications from 'components/Notifications'

import styles from './index.module.scss'
import Link from 'next/link'

const NOTIFICATIONS_ID_PREFIX = 'intro-modal-notifications'

const IntroModal = () => {
	const [isShowing, _setIsShowing] = useRecoilState(introModalIsShowingState)

	const setIsShowing = useCallback(
		(isShowing: boolean) => {
			_setIsShowing(isShowing)
			if (!isShowing) Router.push('/interests')
		},
		[_setIsShowing]
	)

	const hide = useCallback(() => {
		setIsShowing(false)
	}, [setIsShowing])

	return (
		<Modal
			className={styles.root}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className={styles.top}>
				<h2 className={styles.title}>Notifications</h2>
				<p className={styles.subtitle}>You can change these settings later</p>
			</div>
			<Notifications
				className={styles.content}
				idPrefix={NOTIFICATIONS_ID_PREFIX}
				timeClassName={styles.time}
			/>
			<div className={styles.footer}>
				<Link href="/interests">
					<a className={styles.next} onClick={hide}>
						Your interests
						<FontAwesomeIcon
							className={styles.nextIcon}
							icon={faChevronRight}
						/>
					</a>
				</Link>
			</div>
		</Modal>
	)
}

export default IntroModal
