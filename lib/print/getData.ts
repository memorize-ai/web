import { resolve } from 'path'
import chrome from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'
import { compile } from 'handlebars'

import { Context } from './models'
import readFile from 'lib/readFile'

const TEMPLATE_PATH = resolve('templates', 'print.hbs')

let browser: puppeteer.Browser | null = null
let template: HandlebarsTemplateDelegate | null = null

const getBrowser = async () =>
	(browser ??= await chrome.puppeteer.launch({
		args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
		defaultViewport: chrome.defaultViewport,
		executablePath: await chrome.executablePath,
		headless: true,
		ignoreHTTPSErrors: true
	}))

const getTemplate = async () =>
	(template ??= compile(await readFile(TEMPLATE_PATH), { strict: true }))

const getPage = async () => (await getBrowser()).newPage()
const getContent = async (context: Context) => (await getTemplate())(context)

const getData = async (context: Context) => {
	const [page, content] = await Promise.all([getPage(), getContent(context)])

	await page.setContent(content)

	const data = await page.pdf()
	await page.close()

	return data
}

export default getData
