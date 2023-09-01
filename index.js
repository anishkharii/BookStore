import express from "express";
import mongoose from "mongoose";
mongoose.connect('mongodb+srv://bhautik:24122003@cluster0.vnjxaaq.mongodb.net/StudentDb').then(() => { console.log("Done") })
const app = express()
const Scema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String
    },
    password: {
        type: Number,
    }
})
const StudentDb = mongoose.model("StudentDb", Scema)


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.get('/home', (req, res) => {
    res.render('index.ejs')
})
app.get('/sell', (req, res) => {
    res.render('sell.ejs')
})
app.get('/buy', (req, res) => {
    res.render('buy.ejs')
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
app.get('/review', (req, res) => {
    res.render('review.ejs')
})
app.get('/login', (req, res) => {
    res.render('login.ejs')
})
app.get('/signup', (req, res) => {
    res.render('signup.ejs')
})
app.post('/signup', async (req, res) => {

    try {
        const bd1 = new StudentDb({
            username: req.body.inputname,
            email: req.body.loginemail,
            password: req.body.loginpassword
        })
        let sdata = await bd1.save();
        res.render('signup.ejs')
    } catch (error) {
        res.send("Error in signup")
    }
})
app.post('/login', async (req, res) => {
    try {
        const stuemail = req.body.loginemail
        const stupassword = req.body.loginpassword
        const finddata = await StudentDb.findOne({ email: stuemail })
        if (finddata.email == stuemail && finddata.password == stupassword) {
            res.render('login.ejs')
        } else {
            res.send("Error in sign in")
        }
    }
    catch (error) {
        res.send("Error in Login" + error)
    }
})



app.post('/forgot', async (req, res) => {
    try {
        const stuemail = req.body.Forgotemail
        const pass1 = parseInt(req.body.Forgotpassword1)
        const pass2 = parseInt(req.body.Forgotpassword2)
        if (pass1 === pass2) {
            try {
                const finddata = await StudentDb.updateOne({ email: stuemail }, { password: pass1 })
                res.render('forgot.ejs')
            } catch (error) {
                res.send(error)
            }
        } else {
            console.log("please Enter Same Password")
        }


    }
    catch (error) {
        res.send("Error in change password" + error)
    }
})
app.listen(3000, () => {
    console.log("Server Started on port 3000")
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////