import React from 'react'
import { DiscussionEmbed } from 'disqus-react'

import { DISQUS_SHORTNAME, DISQUS_URL } from '../../constants'

export default ({ title, id }: { title: string, id: string }) => (
	<DiscussionEmbed
		shortname={DISQUS_SHORTNAME}
		config={{
			url: DISQUS_URL,
			identifier: id,
			title
		}}
	/>
)
