import React from 'react'
import { createPortal } from 'react-dom'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

const element = document.getElementById('toast') ?? document.body

const ToastPortal = () =>
	createPortal(<ToastContainer />, element)

export default ToastPortal
