import React from 'react'
import { Link } from 'react-router-dom'

import Navbar from '../shared/Navbar'
import Header from './Header'
import Boxes from './Boxes'
import Screenshots from './Screenshots'
import Integrations from './Integrations'
import Footer from './Footer'
import firebase from '../../firebase'

import 'firebase/analytics'

const analytics = firebase.analytics()

export default () => {
	analytics.setCurrentScreen('home')
	
	return (
		<>
			<Navbar>
				<Link
					to="/auth"
					className="
						home
						navbar-item-auth
						px-4
						text-xl
						text-white
						font-bold
						bg-black
						rounded-lg
					"
				>
					Log in <span className="opacity-50">/</span> Sign up
				</Link>
			</Navbar>
			<Header />
			<Screenshots />
			<Boxes />
			<Integrations />
			<Footer />
		</>
	)
}
