import React from 'react'

import Policy from '../shared/Policy'
import { APP_STORE_DESCRIPTION } from '../shared/Head'

export default () => (
	<Policy
		id="support"
		title="Support"
		description={`Contact memorize.ai's support by emailing support@memorize.ai. ${APP_STORE_DESCRIPTION}`}
	>
		Email us at support@memorize.ai or by post to:<br /><br />
		memorize.ai<br />
		1717 Curtis Avenue<br />
		Manhattan Beach, CA 90266<br />
		United States
	</Policy>
)
