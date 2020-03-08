import React from 'react'

import Box from './Box'
import decksImage from '../../images/home-boxes/decks.png'
import artificialIntelligenceImage from '../../images/home-boxes/artificial-intelligence.png'
import fasterResultsImage from '../../images/home-boxes/faster-results.png'
import communityImage from '../../images/home-boxes/community.png'
import editorImage from '../../images/home-boxes/editor.png'
import integrateImage from '../../images/home-boxes/integrate.png'

export const boxes = [
	{
		image: decksImage,
		title: '40,000+ decks',
		description: 'Explore our collection of decks and flashcards. Choose your interests and get recommendations based on what you like.'
	},
	{
		image: artificialIntelligenceImage,
		title: 'Artificial Intelligence',
		description: 'We use AI to help determine the spacing between recall attempts. We predict the perfect memorization timing so you can remember an extraordinary amount with very little studying!'
	},
	{
		image: fasterResultsImage,
		title: 'Faster Results',
		description: 'What if you need to cram information quickly? Review decks quickly and easily with our Cram mode, designed for studying in a compressed amount of time.'
	},
	{
		image: communityImage,
		title: 'Community of learners',
		description: 'We are a community of learners that create decks for one another; all decks are public, and anyone can use them. Share your knowledge with the world.'
	},
	{
		image: editorImage,
		title: 'Beautiful, rich content',
		description: 'The cards you work with are beautiful and easy to create. No other platform has an editor like memorize.ai does. from images to math to code, we have everything covered!'
	},
	{
		image: integrateImage,
		title: 'Easy to integrate',
		description: 'memorize.ai can easily fit in your current workflow with integration support for Canvas, Schoology, Google Classroom, and more!'
	}
]

export default () => (
	<div className="home boxes grid gap-4 justify-center mt-10">
		{boxes.map(({ image, title, description }) => (
			<Box image={image} title={title} description={description} />
		))}
	</div>
)
