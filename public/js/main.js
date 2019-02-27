document.addEventListener('DOMContentLoaded', () =>
    document.querySelectorAll('.navbar-burger').forEach(el =>
        el.addEventListener('click', () => {
            const target = el.dataset.target
            const $target = document.getElementById(target)
            el.classList.toggle('is-active')
            $target.classList.toggle('is-active')
        })
    )
)