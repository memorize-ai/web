import { readdirSync } from 'fs'
import { join } from 'path'

import Post from 'models/Post'
import { USERS } from 'models/User'

const POSTS = join(process.cwd(), 'posts')

export default (): Post[] =>
	readdirSync(POSTS).map(path => {
		const { meta } = require(`../posts/${path}`)
		const by = USERS[meta.by]
		
		if (!by)
			throw new Error(`Unable to find user "${meta.by}"`)
		
		return { ...meta, slug: path.replace(/\.mdx$/, ''), by }
	})
