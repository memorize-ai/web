import React from 'react'

import Box from './Box'
import decksImage from '../../images/home-boxes/decks.webp'
import artificialIntelligenceImage from '../../images/home-boxes/artificial-intelligence.webp'
import fasterResultsImage from '../../images/home-boxes/faster-results.webp'
import communityImage from '../../images/home-boxes/community.webp'
import editorImage from '../../images/home-boxes/editor.webp'
import integrateImage from '../../images/home-boxes/integrate.webp'

import '../../scss/components/Home/Boxes.scss'

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
		className="home boxes"
	>
		{boxes.map((box, index) => (
			<Box key={index} {...box} index={index} />
		))}
	</div>
)
