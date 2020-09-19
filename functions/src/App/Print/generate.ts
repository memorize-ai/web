import { readFile } from 'fs'
import { join } from 'path'
import { Browser, launch } from 'puppeteer'
import { compile } from 'handlebars'

const TEMPLATE_PATH = join(__dirname, 'template.html')

let browser: Browser | null = null
let template: HandlebarsTemplateDelegate | null = null

export interface PrintableCard {
	front: string
	back: string
}

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

const getContent = async (cards: PrintableCard[]) =>
	(await getTemplate())({ cards })

export default async (cards: PrintableCard[]) => {
	const [page, content] = await Promise.all([
		getPage(),
		getContent(cards)
	])
	
	await page.setContent(content)
	const data = await page.pdf()
	
	await page.close()
	return data
}
