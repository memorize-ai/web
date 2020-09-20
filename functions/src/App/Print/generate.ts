import { readFile } from 'fs'
import { join } from 'path'
import { Browser, launch } from 'puppeteer'
import { compile } from 'handlebars'

import { BASE_PATH } from '../../constants'
import Print from './models'

const TEMPLATE_PATH = join(BASE_PATH, 'assets/print.html')

let browser: Browser | null = null
let template: HandlebarsTemplateDelegate | null = null

const getPage = async () =>
	(browser ??= await launch()).newPage()

const getTemplate = async () =>
	template ??= compile(
		await new Promise((resolve, reject) => readFile(
			TEMPLATE_PATH,
			'utf8',
			(error, data) => error ? reject(error) : resolve(data)
		)),
		{ strict: true }
	)

const getContent = async (context: Print.Context) =>
	(await getTemplate())(context)

export default async (context: Print.Context) => {
	const [page, content] = await Promise.all([
		getPage(),
		getContent(context)
	])
	
	await page.setContent(content)
	const data = await page.pdf()
	
	await page.close()
	return data
}
