const glob = require('glob')
const { join } = require('path')
const { getType } = require('mime')

const { storage } = require('../utils/firebase-admin')

if (require.main === module)
	(async () => {
		const paths = glob.sync(join(__dirname, '../../public/build/static/**/*.*'))
		
		console.log(`Found ${paths.length} assets`)
		
		let i = 0
		
		await Promise.all(paths.map(async path => {
			const name = path.slice(path.lastIndexOf('/') + 1)
			const contentType = getType(path)
			
			if (!contentType)
				throw new Error('Unknown content type')
			
			await storage.upload(path, {
				destination: `public-assets/${name}`,
				contentType
			})
			
			console.log(`Uploaded asset ${++i}/${paths.length} as ${name} (${contentType})`)
		}))
		
		console.log(`Finished uploading ${paths.length} assets`)
	})()
