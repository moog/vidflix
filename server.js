'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const consign = require('consign')
const methodOverride = require('method-override')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// scripts autoload
consign({ verbose: false })
    .include('config.js')
    .then('db.js')
    .then('middlewares')
    .then('models')
    .then('controllers')
    .then('routes')
    .into(app)

// associate
Object.keys(app.models).forEach((modelName) => {
    if('associate' in app.models[modelName]) {
        console.log('entrou', modelName);
        app.models[modelName].associate(app.models);
    }
})

// authentication middleware
app.use(app.middlewares.auth.initialize())

// server init
app.listen(2626, function () {
    console.log('Video store is open!')
})

module.exports = app
