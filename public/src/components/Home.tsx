import React from 'react'
import { Heading } from 'react-bulma-components'

import Disqus from './Disqus'

import '../scss/Home.scss'

export default () => (
	<div id="home">
		<Heading textAlignment="centered">Welcome to memorize.ai</Heading>
		<Disqus title="Home" id="home" />
	</div>
)
