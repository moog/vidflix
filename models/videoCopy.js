'use strict'

module.exports = (app) => {
    const Sequelize = require('sequelize')

    const videoCopySchema = {
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        rented: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }

    const options = {
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                // define an foreign key to video
                models.videoCopy.belongsTo(models.video, { foreignKey: 'videoUUID', targetKey: 'uuid' })
                models.videoCopy.sync()
            }
        }
    }

    const videoCopyDefine = app.db.define('VideosCopies', videoCopySchema, options)

    return videoCopyDefine;
}
