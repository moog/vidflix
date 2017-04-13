module.exports = app => {
    const JwtStrategy = require('passport-jwt').Strategy
    const ExtractJwt = require('passport-jwt').ExtractJwt
    const passport = require('passport')

    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: app.config.auth.secret
    }

    passport.use(new JwtStrategy(opts, function (jwt, done) {
        app.models.customer
            .findOne({
                where: {
                    uuid: jwt.uuid
                }
            })
            .then((customer) => {
                if (!customer) {
                    done(null, false)
                } else {
                    done(null, customer.dataValues)
                }
            })
    }))

    return {
        initialize: () => {
            return passport.initialize()
        },
        authenticate: () => {
            return passport.authenticate("jwt", app.config.auth.session)
        }
    };
};
