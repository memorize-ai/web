import React from 'react'
import { DiscussionEmbed } from 'disqus-react'

import { disqusShortname, disqusUrl } from '../constants'

export default ({ title, id }: { title: string, id: string }) => (
	<DiscussionEmbed
		shortname={disqusShortname}
		config={{
			url: disqusUrl,
			identifier: id,
			title
		}}
	/>
)
