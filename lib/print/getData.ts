import { resolve } from 'path'
import puppeteer from 'puppeteer'
import { compile } from 'handlebars'

import { Context } from './models'
import readFile from 'lib/readFile'

const TEMPLATE_PATH = resolve('assets', 'print.hbs')

let browser: puppeteer.Browser | null = null
let template: HandlebarsTemplateDelegate | null = null

const getPage = async () =>
	(browser ??= await puppeteer.launch()).newPage()

const getTemplate = async () =>
	template ??= compile(await readFile(TEMPLATE_PATH), { strict: true })

const getContent = async (context: Context) =>
	(await getTemplate())(context)

const getData = async (context: Context) => {
	const [page, content] = await Promise.all([
		getPage(),
		getContent(context)
	])
	
	await page.setContent(content)
	
	const data = await page.pdf()
	await page.close()
	
	return data
}

export default getData
