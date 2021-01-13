export const isIos = () =>
	process.browser
		? /iPhone|iPad|iPod/.test(navigator.userAgent) &&
		  !(window.MSStream as unknown)
		: null

/** Does not include iPads */
export const isIosHandheld = () =>
	process.browser
		? /iPhone|iPod/.test(navigator.userAgent) && !(window.MSStream as unknown)
		: null
