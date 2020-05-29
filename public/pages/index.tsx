import useAuthState from 'hooks/useAuthState'
import DashboardHome from 'components/Dashboard/Home'
import Home from 'components/Home'

export default () =>
	useAuthState() ? <DashboardHome /> : <Home />
