'use strict'

module.exports = function(app) {
    const Sequelize = require('sequelize');

    const directorSchema = {
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        }
    }

    const options = {
        freezeTableName: true
    }

    const directorDefine = app.db.define('Directors', directorSchema, options)
    directorDefine.sync()

    return directorDefine;
}
