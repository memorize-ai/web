const glob = require('glob')
const { join } = require('path')

const { storage } = require('../utils/firebase-admin')

if (require.main === module)
	(async () => {
		const paths = glob.sync(join(__dirname, '../../public/build/static/**/*.*'))
		
		console.log(`Found ${paths.length} assets`)
		
		let i = 0
		
		await Promise.all(paths.map(async path => {
			const name = path.slice(path.lastIndexOf('/') + 1)
			
			await storage.upload(path, {
				destination: `public-assets/${name}`
			})
			
			console.log(`Uploaded asset ${++i}/${paths.length} as ${name}`)
		}))
		
		console.log(`Finished uploading ${paths.length} assets`)
	})()
