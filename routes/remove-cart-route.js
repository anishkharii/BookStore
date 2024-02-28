const express = require('express');
const router = express.Router();
const StudentDb = require('../public/src/mongoose')
const { authlogin } = require('./cookie-auth')

router.get('/remove/:bookname', authlogin, async (req, res) => {
    const removebookname = req.params.bookname
    const removeuseremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: removeuseremail })
    let findcartarray = await userdatas.cart
    for (let index = 0; index < findcartarray.length; index++) {
        if (findcartarray[index].bookname == removebookname) {
            findcartarray.splice(index, 1);
        }
    }
    const updatedata = await StudentDb.updateOne({ email: removeuseremail }, { $set: { cart: findcartarray } });
    req.flash('expressFlash', `Book Deleted From Cart!!`)

    res.redirect('/cart')
})
module.exports = router;