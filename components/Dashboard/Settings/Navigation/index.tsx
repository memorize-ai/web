import { useRouter } from 'next/router'
import { faBell, faCode, faUser } from '@fortawesome/free-solid-svg-icons'

import Link from './Link'

const SettingsNavigation = () => {
	const current = useRouter().asPath

	return (
		<nav>
			<Link current={current} href="/settings" icon={faUser}>
				Account
			</Link>
			<Link current={current} href="/settings/notifications" icon={faBell}>
				Notifications
			</Link>
			<Link current={current} href="/settings/develop" icon={faCode}>
				Develop
			</Link>
		</nav>
	)
}

export default SettingsNavigation
