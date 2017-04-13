module.exports = (app) => {
    const controller = app.controllers.video
    const auth = app.middlewares.auth

    app.get('/api/videos/', auth.authenticate(), controller.search)
    app.get('/api/videos/:page', auth.authenticate(), controller.search)
    app.get('/api/videos/:page/:searchTitle', auth.authenticate(), controller.search)
    app.post('/api/videos/rent', auth.authenticate(), controller.rent)
    app.post('/api/videos/rentReturn', auth.authenticate(), controller.rentReturn)
}
