import Settings from '..'
import GitHub from './GitHub'
import Api from './Api'

const DeveloperSettings = () => (
	<Settings title="Develop" description="Develop for memorize.ai">
		<GitHub />
		<Api />
	</Settings>
)

export default DeveloperSettings
