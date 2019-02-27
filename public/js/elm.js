const log = message => object => {
    console.log(message, object)
    return object
}
const listenSignOut = app =>
    app.ports.signOut.subscribe(() => firebase.auth().signOut()
        .then(() => app.ports.signedOut.send(null))
    )
