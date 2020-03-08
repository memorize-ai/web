import React from 'react'

import Logo, { LogoType } from '../shared/Logo'
import ListItem from './IntegrationsListItem'
import canvasImage from '../../images/home-integrations/canvas.png'

export const listItems = [
	'Share your deck with a simple link',
	'Embed in your blog posts or ebooks',
	'Unlock sections for each chapter for your students',
	'Works with Canvas, Schoology, Google Classroom, and more!'
]

export const integrations = [
	{
		src: canvasImage,
		alt: 'Canvas'
	},
	{
		src: canvasImage,
		alt: 'Canvas'
	},
	{
		src: canvasImage,
		alt: 'Canvas'
	},
	{
		src: canvasImage,
		alt: 'Canvas'
	},
	{
		src: canvasImage,
		alt: 'Canvas'
	},
	{
		src: canvasImage,
		alt: 'Canvas'
	}
]

export default () => (
	<div className="home integrations flex">
		<div className="left">
			<Logo type={LogoType.CapitalInverted} className="logo" />
			<h1>Integrate your decks in your classroom, lecture review, and notes!</h1>
			<div className="items">
				{listItems.map((title, index) => (
					<ListItem key={index} title={title} />
				))}
			</div>
		</div>
		<div className="right grid">
			{/* TODO: Add images */}
		</div>
	</div>
)
