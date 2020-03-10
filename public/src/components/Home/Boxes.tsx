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
		description: 'Explore our collection of decks and flashcards. Choose your interests and get recommendations based on what you like.'
	},
	{
		image: fasterResultsImage,
		title: 'Faster Results',
		description: 'Explore our collection of decks and flashcards. Choose your interests and get recommendations based on what you like.'
	},
	{
		image: communityImage,
		title: 'Community of learners',
		description: 'Explore our collection of decks and flashcards. Choose your interests and get recommendations based on what you like.'
	},
	{
		image: editorImage,
		title: 'Beautiful, rich content',
		description: 'Explore our collection of decks and flashcards. Choose your interests and get recommendations based on what you like.'
	},
	{
		image: integrateImage,
		title: 'Easy to integrate',
		description: 'Explore our collection of decks and flashcards. Choose your interests and get recommendations based on what you like.'
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
