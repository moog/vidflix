'use strict'

module.exports = (app) => {
    const Sequelize = require('sequelize');

    const videoSchema = {
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                min: 2,
                max: 50
            }
        }
    }

    const options = {
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                // define an foreign key to director
                models.video.belongsTo(models.director, { foreignKey: "directorUUID", targetKey: "uuid" })
                models.video.sync()
            }
        }
    }
    
    const videoDefine = app.db.define('Videos', videoSchema, options)

    return videoDefine;
}
