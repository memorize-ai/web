cookie('uid') === undefined
	? null
	: document.querySelectorAll('.navbar-end-auth-buttons').forEach(element => element.classList.add('is-hidden'))