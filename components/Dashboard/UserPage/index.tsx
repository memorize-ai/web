import { NextPage } from 'next'

import { UserPageProps } from './models'

const UserPage: NextPage<UserPageProps> = ({ user }) => {
	return <>{user.name}</>
}

export default UserPage
