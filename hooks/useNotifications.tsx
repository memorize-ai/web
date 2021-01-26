import { useEffect } from 'react'
import Router from 'next/router'
import { toast } from 'react-toastify'

import firebase from 'lib/firebase'
import setToken from 'lib/setToken'
import handleError from 'lib/handleError'
import useCurrentUser from './useCurrentUser'

import styles from 'components/Notification/index.module.scss'

import 'firebase/messaging'

const useNotifications = () => {
	const [currentUser] = useCurrentUser()

	const id = currentUser?.id
	const notifications = currentUser?.notifications?.type

	useEffect(() => {
		if (id && notifications && notifications !== 'none') setToken(id)
	}, [id, notifications])

	useEffect(() => {
		firebase.messaging().onMessage(({ data }) => {
			if (typeof data !== 'object') return
			const { url, title, body } = data

			if (
				!(
					typeof url === 'string' &&
					typeof title === 'string' &&
					typeof body === 'string'
				)
			)
				return

			Router.prefetch(url)
			toast.dark(
				<>
					<p className={styles.title}>{title}</p>
					<p className={styles.body}>{body}</p>
				</>,
				{ onClick: () => Router.push(url) }
			)
		}, handleError)
	}, [])
}

export default useNotifications
