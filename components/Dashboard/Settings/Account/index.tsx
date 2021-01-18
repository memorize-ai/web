import Settings from '..'
import Name from './Name'

import styles from './index.module.scss'

const AccountSettings = () => {
	return (
		<Settings title="Account" description="Edit your account">
			<Name />
		</Settings>
	)
}

export default AccountSettings
