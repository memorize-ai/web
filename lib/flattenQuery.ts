import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

const flattenQuery = <Query extends Record<string, unknown>>(query: Query) =>
	pickBy(query, identity) as Query

export default flattenQuery
