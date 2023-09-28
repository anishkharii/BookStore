const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser')
const bodyparser = require('body-parser')
const app = express()
const bcrypt = require('bcrypt')
const uploads = require('./public/src/multer')
const saltRounds = 10;
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(cookieparser())
app.set('view engine', 'ejs');
const StudentDb = require('./public/src/mongoose')
const auth = async (req, res, next) => {
    try {
        const usertoken = req.cookies.jwt;
        const verifyuser = jwt.verify(usertoken, 'privateKey')
        next()
    } catch (error) {
        res.redirect('/login')
    }
}
const authlogin = async (req, res, next) => {
    try {
        const usertoken = req.cookies.jwtlogin;
        const verifyuser = jwt.verify(usertoken, 'privateKey')
        next()
    } catch (error) {
        res.redirect('/login')
    }
}
app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.get('/home', (req, res) => {
    res.render('index.ejs')
})
app.get('/sell', authlogin, async (req, res) => {
    const email = req.cookies.userinfocookie.email
    const fdata = await StudentDb.findOne({ email: email })
    res.render('sell.ejs', { books: fdata.books })
})
app.get('/buy', authlogin, async (req, res) => {
    const email = req.cookies.userinfocookie.email
    const fdata = await StudentDb.findOne({ email: email })
    res.render('buy.ejs', { books: fdata.books })
})
app.get('/contactus', (req, res) => {
    res.render('contactus.ejs')
})
app.get('/policy', (req, res) => {
    res.render('policy.ejs')
})
app.get('/forgot', (req, res) => {
    res.render('forgot.ejs')
})
app.get('/review', authlogin, async (req, res) => {

})
app.get('/login', (req, res) => {
    res.render('login.ejs')
})
app.get('/viewcart', (req, res) => {
    res.render('cart.ejs')
})
app.get('/signup', (req, res) => {
    res.render('signup.ejs')
})
app.get('/logout', authlogin, async (req, res) => {
    try {
        res.clearCookie("jwtlogin")
        res.redirect('/home')
    } catch (error) {
        console.log(error)
    }
})
app.post('/signup', async (req, res) => {

    if (req.body.loginpassword.length <= 7) {
        res.render("signup.ejs", { errormsg: "Password Should be Must 8 Character!!" })
    }

    bcrypt.hash(req.body.loginpassword, saltRounds, async function (err, hash) {
        try {
            if (err) {
                console.log(err)
            } else {
                let token;

                const fdata = await StudentDb.findOne({ email: req.body.loginemail })
                if (fdata) {
                    res.render("signup.ejs", { errormsg: "Already Registered !!\nPlease Login" })
                }
                else {
                    try {
                        token = await jwt.sign({ username: req.body.loginemail }, 'privateKey');
                    } catch (error) {
                        console.log(error)
                    }
                    res.cookie('jwt', token)

                    const data = new StudentDb({ username: req.body.inputname, email: req.body.loginemail, password: hash, token: token })
                    const saved = await data.save();
                    res.redirect('/home')
                }
            }
        } catch (error) {
            res.render("signup.ejs", { errormsg: "Error in SignUp" })
        }
    });
})
app.post('/login', async (req, res) => {
    let token;
    try {
        const stuemail = req.body.loginemail
        const stupassword = req.body.loginpassword

        const finddata = await StudentDb.findOne({ email: stuemail })
        bcrypt.compare(stupassword, finddata.password, async function (err, result) {
            if (result) {
                token = await jwt.sign({ email: stuemail }, 'privateKey');
                const userinfo = {
                    email: stuemail
                }
                res.cookie('jwtlogin', token)
                res.cookie('userinfocookie', userinfo)
                res.redirect('/home')
            } else {
                res.render('login.ejs', { errormsg: "Wrong Password Enter!!" })
            }
        });
    }
    catch (error) {
        res.render("login.ejs", { errormsg: "Account Not Found!!" })
    }
})
app.post('/forgot', async (req, res) => {
    const email = req.body.Forgotemail;
    const password1 = req.body.Forgotpassword1
    const password2 = req.body.Forgotpassword2
    let msg;
    try {
        const data = await StudentDb.findOne({ email: email })
        if (password1 != password2) {
            msg = 'Password Are Not Match!!'
            res.render('forgot.ejs', { errormassage: msg })
        }
        const updatedata = await StudentDb.updateOne({ password: password1 })
        res.redirect('/login')
    } catch (error) {
        msg = error
        res.render('forgot.ejs', { errormassage: msg })
    }
})

app.post('/addbook', uploads.single('inputimg'), async (req, res) => {
    res.redirect('/sell')
})
app.listen(3000, () => {
    console.log("Server Started on port 3000")
})