import { useMemo } from 'react'
import { NextPage } from 'next'

import { UserPageProps } from './models'
import User from 'models/User'
import Deck from 'models/Deck'
import formatNumber, { formatNumberAsInt } from 'lib/formatNumber'
import { BASE_URL } from 'lib/constants'
import useCurrentUser from 'hooks/useCurrentUser'
import useUser from 'hooks/useUser'
import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import Head from 'components/Head'
import Image from './Image'
import Level from './Level'
import Contact from './Contact'
import EditBio from './EditBio'
import Bio from './Bio'
import Activity from './Activity'
import Decks from './Decks'

import { src as defaultImage } from 'images/defaults/user.jpg'
import styles from './index.module.scss'

const UserPage: NextPage<UserPageProps> = ({
	user: userData,
	activity,
	decks: deckData,
	bio
}) => {
	const [currentUser] = useCurrentUser()

	const initialUser = useMemo(() => new User(userData), [userData])
	const user = useUser(initialUser.id) ?? initialUser

	const decks = useMemo(() => deckData.map(data => new Deck(data)), [deckData])

	const name = user.name ?? 'Anonymous'

	return (
		<Dashboard
			className={styles.root}
			sidebarClassName={styles.sidebar}
			contentClassName={styles.container}
			selection={Selection.Home}
		>
			<Head
				title={`${name} | memorize.ai`}
				description={bio || `View ${name}'s profile on memorize.ai`}
				image={user.imageUrl ?? defaultImage}
				labels={[
					{ name: 'Level', value: formatNumberAsInt(user.level ?? 0) },
					{ name: 'XP', value: formatNumber(user.xp ?? 0) },
					{ name: 'Decks created', value: formatNumber(decks.length) }
				]}
				breadcrumbs={url => [[{ name, url }]]}
				schema={[
					{
						'@type': 'ProfilePage',
						mainEntity: {
							'@type': 'Person',
							name: user.name ?? 'Anonymous',
							image: user.imageUrl ?? defaultImage,
							url: `${BASE_URL}/u/${user.slugId ?? 'error'}/${
								user.slug ?? 'error'
							}`
						}
					}
				]}
			/>
			<div className={styles.content}>
				<div className={styles.top}>
					<Image user={user} />
					<div className={styles.meta}>
						<h1 className={styles.name}>{name}</h1>
						<Level user={user} />
						<Contact user={user} />
					</div>
					<div className={styles.main}>
						{currentUser?.id === user.id ? (
							<EditBio user={user} />
						) : user.bio ? (
							<Bio user={user} />
						) : null}
						<Activity user={user} activity={activity} />
					</div>
				</div>
				{decks.length > 0 && <Decks user={user} decks={decks} />}
			</div>
		</Dashboard>
	)
}

export default UserPage
