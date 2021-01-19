import Settings from '..'
import Profile from './Profile'
import Name from './Name'
import ForgotPassword from './ForgotPassword'
import SignOut from './SignOut'

const AccountSettings = () => (
	<Settings title="Account" description="Edit your account">
		<Profile />
		<Name />
		<ForgotPassword />
		<SignOut />
	</Settings>
)

export default AccountSettings
