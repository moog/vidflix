module.exports = function(app) {
    const controller = app.controllers.customer
    const auth = app.middlewares.auth

    app.post('/api/customer', controller.create)
    app.post('/api/customer/logon', controller.logon)
}
