import { useEffect } from 'react'
import Router from 'next/router'
import { toast } from 'react-toastify'

import firebase from 'lib/firebase'
import setToken from 'lib/setToken'
import handleError from 'lib/handleError'
import useCurrentUser from './useCurrentUser'
import Notification from 'components/Notification'

import 'firebase/messaging'

const useNotifications = () => {
	const [currentUser] = useCurrentUser()

	const id = currentUser?.id
	const notifications = currentUser?.notifications?.type

	useEffect(() => {
		if (id && notifications && notifications !== 'none') setToken(id)
	}, [id, notifications])

	useEffect(() => {
		const messaging = firebase.messaging()

		return messaging.onMessage(({ data }) => {
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
			toast.dark(<Notification title={title} body={body} />, {
				onClick: () => {
					Router.push(url)
				}
			})
		}, handleError)
	}, [])
}

export default useNotifications
