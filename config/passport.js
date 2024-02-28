const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('../public/src/google-mongoose')
module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: "233915381064-uipfagp6ta188p2vq6dn1n4sfqhi0g83.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3000/google/callback",
            passReqToCallback: true
        }, async function (request, accessToken, refreshToken, profile, done) {
            try {
                let user = await StudentDb.findOne({ email: profile.email })
                if (!user) {

                    const data = new StudentDb({ username: profile.displayName, email: profile.email })
                    const saved = await data.save();
                    done(null, user)
                }
            } catch (error) {
                console.log(error)
            }
            return done(null, profile)

        })
    )
}
