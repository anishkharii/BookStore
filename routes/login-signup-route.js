const express = require('express');
const router = express.Router();
const { authlogin } = require('./cookie-auth')
const StudentDb = require('../public/src/mongoose')
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser')
const bcrypt = require('bcrypt')
router.get('/login', (req, res) => {
    res.render('login.ejs', { expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
})

router.get('/signup', (req, res) => {
    res.render('signup.ejs', { expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
})
router.get('/logout', async (req, res) => {

    res.clearCookie("jwtlogin")
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('expressFlash', 'LogOut SuccessFully Done!')
        res.redirect('/');
    });

})
router.post('/signup', async (req, res) => {

    if (req.body.loginpassword.length <= 7 || req.body.loginpassword.length == 0) {
        res.render("signup.ejs", { errormsg: "Password Should be Must 8 Character!!", expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
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
                    req.flash('expressFlash', 'Sign In SuccessFul Done!!')
                    res.redirect('/home');
                }
            }
        } catch (error) {
            req.flash('expressFlash', 'Error in SignUp!')
            res.redirect("/signup")
        }
    });
})
router.post('/login', async (req, res) => {
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
                useremail = stuemail
                req.flash('expressFlash', 'Login SuccessFully Done!')
                res.redirect('/home')
            } else {
                req.flash('expressFlash', 'User not Found!!')
                res.redirect('/login')
            }
        });
    }
    catch (error) {
        res.render("login.ejs", { errormsg: "Account Not Found!!", expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
    }
})

router.post('/forgot', async (req, res) => {
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
        bcrypt.hash(password1, saltRounds).then(hash => {
            const updatedata = StudentDb.updateOne({ email: email }, { $set: { password: password1 } })
            req.flash('expressFlash', 'PassWord change SuccessFully!')
            res.redirect('/login')
        })
            .catch(err => console.error(err.message))

    } catch (error) {
        res.render('forgot.ejs', { errormassage: error })
    }
})

module.exports = router;


