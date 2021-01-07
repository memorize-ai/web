import { readFile as _readFile } from 'fs'

const readFile = (path: string) =>
	new Promise<string>((resolve, reject) => {
		_readFile(path, 'utf8', (error, data) => {
			error ? reject(error) : resolve(data)
		})
	})

export default readFile
