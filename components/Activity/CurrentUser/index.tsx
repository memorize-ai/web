import useCurrentUser from 'hooks/useCurrentUser'
import Activity from '..'

export interface CurrentUserActivityProps {
	className?: string
}

const CurrentUserActivity = ({ className }: CurrentUserActivityProps) => {
	const [currentUser] = useCurrentUser()
	return <Activity className={className} id={currentUser && currentUser.id} />
}

export default CurrentUserActivity
