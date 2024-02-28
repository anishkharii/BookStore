const express = require('express');
const router = express.Router();
const { authlogin } = require('./cookie-auth')
const StudentDb = require('../public/src/mongoose')
const jsonFilePath = './public/prapi.json';
const fs = require('fs')
router.get('/cart', async (req, res) => {
    const cartviewuseremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: cartviewuseremail })
    const findcartarray = await userdatas.cart
    res.render('cart.ejs', { books: findcartarray, expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
})

router.get('/addtocart/:bookname', authlogin, async (req, res) => {
    const cartaddbookname = req.params.bookname;
    const useremail = req.cookies.userinfocookie['email']
    const finddata = await StudentDb.findOne({ email: useremail })
    let newcartarray = finddata.cart
    fs.readFile(jsonFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        let existingData;
        try {
            existingData = JSON.parse(data);
            const findbook = await existingData.find(book => book.bookname === cartaddbookname);
            newobj = findbook;
            newobj['quantity'] = 1;
            const cartarr = await newcartarray.find(book => book.bookname === cartaddbookname);
            if (cartarr == undefined) {
                newcartarray.push(newobj)
            }
            await StudentDb.updateOne({ email: useremail }, { $set: { cart: newcartarray } })
            req.flash('expressFlash', 'Book Added in Cart!')
            res.redirect('/buy')
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return;
        }
    })


})
router.get('/increase/:bookname', authlogin, async (req, res) => {

    const cartviewuseremail = req.cookies.userinfocookie['email']
    const bookname = req.params.bookname
    const userdatas = await StudentDb.findOne({ email: cartviewuseremail })
    let findcartarray = await userdatas.cart
    findcartarray.forEach(element => {
        if (element.bookname === bookname) {
            element.quantity = element.quantity + 1;
        }
    })
    const updatedata = await StudentDb.updateOne({ email: cartviewuseremail }, { $set: { cart: findcartarray } });
    req.flash('expressFlash', `${bookname} Quantity Increase!!`)

    res.redirect('/cart')
})
router.get('/decrease/:bookname', authlogin, async (req, res) => {

    const cartviewuseremail = req.cookies.userinfocookie['email']
    const bookname = req.params.bookname
    const userdatas = await StudentDb.findOne({ email: cartviewuseremail })
    let findcartarray = await userdatas.cart
    findcartarray.forEach(element => {
        if (element.bookname === bookname) {
            if (element.quantity > 1) {
                element.quantity = element.quantity - 1;
            }
        }
    })
    const updatedata = await StudentDb.updateOne({ email: cartviewuseremail }, { $set: { cart: findcartarray } });
    req.flash('expressFlash', `${bookname} Quantity decrease!!`)
    res.redirect('/cart')
})
router.get('/viewcart', authlogin, async (req, res) => {
    res.redirect('/cart')
})
module.exports = router;