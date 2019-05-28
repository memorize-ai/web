const log = message => object => {
    console.log(message, object)
    return object
}
const listenSignOut = app =>
    app.ports.signOut.subscribe(() => firebase.auth().signOut()
        .then(() => app.ports.signedOut.send(null))
    )
const redirectToLogin = from =>
    window.location.href = `login?f=${from}.html`
const urlParam = param =>
    new URLSearchParams(window.location.search).get(param)
const urlParamExists = param =>
    typeof urlParam(param) == 'string'
