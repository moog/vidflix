'use strict'

module.exports = (app) => {
    const Sequelize = require('sequelize')

    const customerSchema = {
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                min: 2,
                max: 50
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                len: [6, 244]
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [6, 20]
            }
        }
    }

    const options = {
        freezeTableName: true
    }

    const customerDefine = app.db.define('Customers', customerSchema, options)
    customerDefine.sync()

    return customerDefine;
}
