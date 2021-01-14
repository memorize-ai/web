import { useMemo } from 'react'
import { NextPage } from 'next'
import stripHtml from 'string-strip-html'

import { UserPageProps } from './models'
import User from 'models/User'
import Deck from 'models/Deck'
import useCurrentUser from 'hooks/useCurrentUser'
import useUser from 'hooks/useUser'
import useCreatedDecks from 'hooks/useCreatedDecks'
import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import Head from 'components/Head'
import Stats from './Stats'
import EditBio from './EditBio'
import Bio from './Bio'

import styles from './index.module.scss'

const UserPage: NextPage<UserPageProps> = ({
	user: userData,
	decks: deckData
}) => {
	const [currentUser] = useCurrentUser()

	const initialUser = useMemo(() => new User(userData), [userData])
	const user = useUser(initialUser.id) ?? initialUser

	const initialDecks = useMemo(() => deckData.map(data => new Deck(data)), [
		deckData
	])
	const decks = useCreatedDecks(initialDecks)

	const name = user.name ?? 'Anonymous'
	const bioString = useMemo(() => user.bio && stripHtml(user.bio).result, [
		user.bio
	])

	return (
		<Dashboard
			className={styles.root}
			sidebarClassName={styles.sidebar}
			contentClassName={styles.container}
			selection={Selection.Home}
		>
			<Head
				title={`${name} | memorize.ai`}
				description={bioString || `View ${name}'s profile on memorize.ai`}
				breadcrumbs={url => [[{ name, url }]]}
			/>
			<div className={styles.content}>
				<h1 className={styles.name}>{name}</h1>
				<Stats user={user} decks={decks} />
				{currentUser?.id === user.id ? (
					<EditBio user={user} />
				) : (
					<Bio user={user} />
				)}
			</div>
		</Dashboard>
	)
}

export default UserPage
