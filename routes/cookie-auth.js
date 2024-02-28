const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser')

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


module.exports = { auth, authlogin }