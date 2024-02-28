require('dotenv').config()
const mongoose = require('mongoose')
const pupperteer = require('puppeteer');
const express = require('express')
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser')
const passport = require('passport');
const bodyparser = require('body-parser')
const app = express()
const bcrypt = require('bcrypt')
const uploads = require('./public/src/multer')
const saltRounds = 10;
const session = require('express-session');
const ejs = require('ejs');
var flash = require('connect-flash');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(cookieparser())
app.use(flash());
app.set('view engine', 'ejs');
const StudentDb = require('./public/src/mongoose')
const paypal = require('paypal-rest-sdk');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));
require('./public/src/google-login')
app.use(passport.initialize())
app.use(passport.session())
let clientid = "AXQ3WFcygYLmqWseS6-Ep9dfIkCXzYjXxpPrcCH_zPE8CMmEUiPTBdviwe9t9hs0WALsVkK6AWbLFLnD"
let secret = "EFvVwoSGHCyvoQkU-RhxgrItY1B6Lm-HzWsdY4IyvZQqDjTVkP6Efp_4ZikHPhC132xEKd6BcZ8caEVV"
paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AaswiDBSgZz-YTYqpCxQQqQbSwUXVTl_3b6OSYepHG93ihGTEYJsbI3CoJYTOiUzCJ7--St7ZkftejvT',
    'client_secret': 'EOov-ZkWDZjWf0FepB1EFN4VaoKQopE81ygw_oTUFLn-jBYpF1s9JZJ1G6AomYwQpnHqLyYlmaRsuw6L'
});
const GoogleStrategy = require('passport-google-oauth2').Strategy
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    cb(null, user);
});

passport.use(
    new GoogleStrategy({
        clientID: "233915381064-uipfagp6ta188p2vq6dn1n4sfqhi0g83.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/google/callback",
        passReqToCallback: true
    }, async function (request, accessToken, refreshToken, profile, done) {
        try {
            let user = await StudentDb.findOne({ googleid: profile.id })
            if (!user) {
                const data = new StudentDb({ googleid: profile.id, username: profile.displayName, email: profile.email })
                const saved = await data.save();
                done(null, user)
            } else {
                console.log("Already exist")
                return done(null, user)
            }
        } catch (error) {
            console.log(error)
        }

    })
)

app.all('/express-flash', (req, res) => {
    req.flash('success', 'This is a flash message using the express-flash module.');
    res.redirect(301, '/');
})
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/signup' }),
    async function (req, res) {
        const userinfo = {
            email: req.user.email
        }
        let token = await jwt.sign({ email: req.user.email }, 'privateKey');
        res.cookie('jwtlogin', token)
        res.cookie('userinfocookie', userinfo)
        res.redirect('/home')
    });
const homeroute = require('./routes/index')
const buyroute = require('./routes/buy-route')
const sellroute = require('./routes/sell-route')
const cartroute = require('./routes/cart-route')
const delete_update_route = require('./routes/delete-update-route')
const remove_cart_route = require('./routes/remove-cart-route')
const login_signup_route = require('./routes/login-signup-route')
const addbook_route = require('./routes/addbook-route')
const paypal_payment_route = require('./routes/paypal-payment-route')
const profile_route = require('./routes/profile-route')
const wishlist_route = require('./routes/wishlist-route')
const review_route = require('./routes/review-route')
app.get('/', homeroute)
app.get('/contactus', homeroute)
app.get('/policy', homeroute)
app.get('/forgot', homeroute)
app.get('/home', homeroute)
app.get('/sell', sellroute)
app.get('/buy', buyroute)
app.post("/buy/:bookname", buyroute)
app.get('/review', review_route)
app.post('/review/submit', review_route)
app.get('/cart', cartroute)
app.get('/viewcart', cartroute)
app.get('/decrease/:bookname', cartroute)
app.get('/increase/:bookname', cartroute)
app.get('/addtocart/:bookname', cartroute)
app.get('/delete/:params1', delete_update_route)
app.post('/update/:bookname', delete_update_route)
app.post('/update/data/:bookname', delete_update_route)
app.get('/remove/:bookname', remove_cart_route)
app.get('/login', login_signup_route)
app.get('/signup', login_signup_route)
app.post('/login', login_signup_route)
app.post('/signup', login_signup_route)
app.post('/forgot', login_signup_route)
app.get('/logout', login_signup_route)
app.post('/addbook', addbook_route)
app.get('/success', paypal_payment_route)
app.post('/payment', paypal_payment_route)
app.get('/downloadpdf', paypal_payment_route)
app.get('/cancel', paypal_payment_route)
app.get('/profile', profile_route)
app.get('/address', profile_route)
app.get('/orderhistory', profile_route)
app.get('/buyhistory', profile_route)
app.get('/sellhistory', profile_route)
app.post('/name-info', profile_route)
app.post('/useraddress', profile_route)
app.get('/wishlist', wishlist_route)
app.get('/wishlist/:bookname', wishlist_route)
app.get('/wishlist/remove/:bookname', wishlist_route)


app.listen(3000 || process.env.PORT, () => {
    console.log("Server Started on port http://localhost:3000")
})
