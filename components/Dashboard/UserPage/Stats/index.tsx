import User from 'models/User'
import Deck from 'models/Deck'
import { formatNumberAsInt } from 'lib/formatNumber'
import Level from './Level'
import Section from './Section'

import styles from './index.module.scss'

export interface UserPageStatsProps {
	user: User
	decks: Deck[]
}

const UserPageStats = ({ user, decks }: UserPageStatsProps) => (
	<div className={styles.root}>
		<Level className={styles.item} user={user} />
		<Section
			className={styles.item}
			name={`Deck${decks.length === 1 ? '' : 's'} created`}
			value={formatNumberAsInt(decks.length)}
		/>
	</div>
)

export default UserPageStats
