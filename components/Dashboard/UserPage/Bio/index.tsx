import User from 'models/User'

import styles from './index.module.scss'

export interface UserPageBioProps {
	user: User
}

const UserPageBio = ({ user }: UserPageBioProps) => (
	<div id="about" className={styles.root}>
		<h2 className={styles.title}>About</h2>
		<article
			className={styles.content}
			dangerouslySetInnerHTML={{ __html: user.bio ?? '' }}
		/>
	</div>
)

export default UserPageBio
