module.exports = (app) => {
    const Sequelize = require('sequelize')

    const videoRentalSchema = {
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }

    const options = {
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                // create a many-to-many relation between Customers and VideosCopies as VideosRentals
                models.videoRental.belongsTo(models.videoCopy, { foreignKey: 'videoCopyUUID', targetKey: 'uuid' })
                models.videoRental.belongsTo(models.customer, { foreignKey: 'customerUUID', targetKey: 'uuid' })
                models.videoRental.sync()
            }
        }
    }

    const videoRentalDefine = app.db.define('VideosRentals', videoRentalSchema, options)

    return videoRentalDefine;
}
