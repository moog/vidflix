module.exports = function(app) {
    const jwtSimple = require('jwt-simple')

    return {
        create: (req, res) => {
            const newCustomer = app.models.customer.build({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            newCustomer.save()
                .then((customer) => {
                    res.json(customer);
                })
                .catch((err) => {
                    res.json(err);
                });
        },
        logon: (req, res) => {
            const where = { email: req.body.email, password: req.body.password };

            app.models.customer
                .findOne({
                    where: where,
                })
                .then((customer) => {
                    const payload = { uuid: customer.uuid }
                    const token = jwtSimple.encode(payload, app.config.auth.secret)

                    res.json({
                        jwt: token
                    });
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    }
}
