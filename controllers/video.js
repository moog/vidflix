module.exports = (app) => {
    const Sequelize = require('sequelize')
    const Promise = require('bluebird')

    return {
        search: (req, res) => {
            const page = req.params.page || 1
            const perPage = 20
            const title = req.params.searchTitle
            let where = { rented: false }

            // filter by title
            if(title && title.length > 0) {
                where['$Video.title$'] = {
                    $like: '%' + title + '%'
                }
            }

            app.models.videoCopy.findAll({
                attributes: [
                    [Sequelize.col('VideosCopies.videoUUID'), 'uuid'],
                    [Sequelize.col('Video.title'), 'title'],
                    [Sequelize.col('Video.Director.name'), 'director'],
                    [
                        Sequelize.fn('COUNT', Sequelize.col('VideosCopies.rented')),
                        'rentables'
                    ]
                ],
                where: where,
                offset: (page - 1) * perPage, // skip
                limit: perPage,
                group: ['VideosCopies.videoUUID'],
                raw: true,
                include: [
                    {
                        model: app.models.video,
                        attributes: [],
                        include: [
                            {
                                model: app.models.director,
                                attributes: []
                            }
                        ]

                    }
                ]
            })
            .then((videos) => {
                res.json(videos)
            })
            .catch((err) => {
                res.json(err)
            })
        },
        rent: (req, res) => {
            const videoUUID = req.body.videoUUID

            app.models.videoCopy
                .findOne({
                    where: { videoUUID: videoUUID, rented: false }
                })
                .then((videoCopy) => {
                    if (!videoCopy) {
                        return Promise.reject({
                            errors: [
                                { message: 'This video is not available to rent.' }
                            ]
                        })
                    } else {
                        return videoCopy.update({
                            rented: true
                        })
                    }
                })
                .then((videoCopy) => {
                    const rental = app.models.videoRental.build({
                        videoCopyUUID: videoCopy.dataValues.uuid,
                        customerUUID: req.user.uuid
                    })

                    return rental.save();
                })
                .then((videoRental) => {
                    res.json(videoRental);
                })
                .catch((err) => {
                    res.json(err)
                })
        },
        rentReturn: (req, res) => {
            const videoCopyUUID = req.body.videoCopyUUID
            const customerUUID = req.user.uuid

            app.models.videoRental
                .findOne({
                    where: {
                        videoCopyUUID: videoCopyUUID,
                        customerUUID: customerUUID
                    }
                })
                .then((videoRental) => {
                    if (!videoRental) {
                        return Promise.reject({
                            errors: [
                                { message: 'Rental not found' }
                            ]
                        })
                    } else {
                        return videoRental.update({ active: false })
                    }
                })
                .then((videoRental) => {
                    return app.models.videoCopy.findOne({
                            where: { uuid: videoCopyUUID }
                        })
                })
                .then((videoCopy) => {
                    return videoCopy.update({ rented: false })
                })
                .then((videoCopy) => {
                    res.json(videoCopy)
                })
                .catch((err) => {
                    res.json(err.errors)
                })

        },
        bulk: (req, res) => {
            app.models.director.bulkCreate([
                    { name: 'George Miller' },
                    { name: 'Francis Ford Coppola' },
                    { name: 'Richard Linklater' }
                ])
                .then((bulk) => {
                    console.log(bulk);
                    return app.models.video.bulkCreate([
                        { title: 'Mad Max: Fury Road', directorUUID: bulk[0].uuid },
                        { title: 'The Godfather', directorUUID: bulk[1].uuid },
                        { title: 'Boyhood', directorUUID: bulk[2].uuid }
                    ])
                })
                .then((bulk) => {
                    return app.models.videoCopy.bulkCreate([
                        { rented: false, videoUUID: bulk[0].uuid },
                        { rented: false, videoUUID: bulk[0].uuid },
                        { rented: false, videoUUID: bulk[0].uuid },
                        { rented: false, videoUUID: bulk[1].uuid },
                        { rented: false, videoUUID: bulk[1].uuid },
                        { rented: false, videoUUID: bulk[1].uuid },
                        { rented: false, videoUUID: bulk[2].uuid },
                        { rented: false, videoUUID: bulk[2].uuid },
                        { rented: false, videoUUID: bulk[2].uuid },
                    ])
                })
                .then((bulk) => {
                    const customer = app.models.customer.build({
                        name: 'Teste de Teste',
                        email: 'teste@teste.com',
                        password: '123456'
                    })

                    return customer.save()
                })
                .then((customer) => {
                    res.json(customer)
                })
                .catch((err) => {
                    res.json(err)
                })
        }
    }
}
