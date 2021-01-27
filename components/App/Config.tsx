import useAnalytics from 'hooks/useAnalytics'
import useNotifications from 'hooks/useNotifications'

const AppConfig = () => {
	useAnalytics()
	useNotifications()

	return null
}

export default AppConfig
