const queryToString = require('../lib/query').default

it('builds query strings', () => {
	expect(queryToString({ key: 'abc', id: 'def', something: null })).toBe('?key=abc&id=def')
})
