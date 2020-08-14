import { readdirSync } from 'fs'
import { join } from 'path'
import { renderToString } from 'react-dom/server'
import stripHtml from 'string-strip-html'

import Post from 'models/Post'
import { USERS } from 'models/User'

const POSTS = join(process.cwd(), 'posts')

export default () =>
	readdirSync(POSTS)
		.map(path => {
			const { default: Body, meta } = require(`../posts/${path}`)
			const by = USERS[meta.by]
			
			if (!by)
				throw new Error(`Unable to find user "${meta.by}"`)
			
			return {
				...meta,
				slug: path.replace(/\.mdx$/, ''),
				by,
				body: stripHtml(renderToString(<Body />))
			} as Post
		})
		.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
