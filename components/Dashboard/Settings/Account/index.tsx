import Settings from '..'
import Profile from './Profile'
import Name from './Name'
import Email from './Email'
import ForgotPassword from './ForgotPassword'
import Contact from './Contact'
import SignOut from './SignOut'

const AccountSettings = () => (
	<Settings title="Account" description="Edit your account">
		<Profile />
		<Name />
		<Email />
		<ForgotPassword />
		<Contact />
		<SignOut />
	</Settings>
)

export default AccountSettings
