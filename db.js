'use strict'

module.exports = app => {
    const Sequelize = require('sequelize')
    const dbConnection = new Sequelize('mysql://root@localhost:3306/vidflix', { logging: true })

    return dbConnection
}
