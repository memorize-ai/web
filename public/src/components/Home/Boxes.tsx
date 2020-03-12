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
		description: 'Anything you could dream of learning. Create your own decks, and share them with the world.'
	},
	{
		image: artificialIntelligenceImage,
		title: 'Artificial Intelligence',
		description: 'State of the art algorithms to ensure optimal memorization by adjusting when to quiz you.'
	},
	{
		image: communityImage,
		title: 'Spaced repetition',
		description: 'If just the right amount of time has passed between reviewing flashcards, you\'ll see an improvement in memorization like never before.'
	},
	{
		image: fasterResultsImage,
		title: 'Faster results',
		description: 'Through Artificial Intelligence and spaced repetition, not only learn better, but also learn faster.'
	},
	{
		image: editorImage,
		title: 'Beautiful flashcards',
		description: 'Create gorgeous cards using the most advanced editor on your phone. With images, tables, audio, and LaTeX, there are no limits.'
	},
	{
		image: integrateImage,
		title: 'Easy to integrate',
		description: 'Share your decks and unlock your sections with a simple link, available anywhere.'
	}
]

export default () => (
	<div
		id="home-boxes-aos-anchor"
		className="home boxes grid gap-4 justify-center mt-10"
	>
		{boxes.map((box, index) => (
			<Box key={index} {...box} index={index} />
		))}
	</div>
)
