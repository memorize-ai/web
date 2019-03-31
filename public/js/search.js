document.addEventListener('DOMContentLoaded', function() {
})
const startSearch = () => {
    const searchClient = algoliasearch('35UFDKN0J5', 'f15455083b77d602cd3d5f7598b33604')
    const search = instantsearch({
        indexName: 'decks',
        searchClient,
        routing: true,
        searchParameters: { hitsPerPage: 10 },
        searchFunction(helper) {
            console.log('hi')
            const hits = document.querySelector('#hits')
            const pagination = document.querySelector('#pagination')
            
            if (log('helper.state.query')(helper.state.query) === '')
                hits.style.display = pagination.style.display = 'none'
            else
                hits.style.display = pagination.style.display = 'block'
        
            helper.search();
        }
    })
    search.addWidget(instantsearch.widgets.searchBox({ container: '#search-input' }))
    search.addWidget(
        instantsearch.widgets.hits({
            container: '#hits',
            templates: {
                item: document.getElementById('hit-template').innerHTML,
                empty: "We didn't find any decks for <em>\"{{query}}\"</em>"
            }
        })
    )
    search.addWidget(instantsearch.widgets.pagination({ container: '#pagination' }))
    search.start()
}