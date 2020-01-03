import * as functions from 'firebase-functions'

export default functions.pubsub.schedule('every 1 minutes').onRun(context => {
	console.log('PubSub called')
	
	return 0
})
