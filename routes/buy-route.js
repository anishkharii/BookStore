const { authlogin } = require('./cookie-auth')
const express = require('express');
const router = express.Router();
const StudentDb = require('../public/src/mongoose')
const jsonFilePath = './public/prapi.json';
const fs = require('fs')
router.get('/buy', async (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        let existingData;
        try {
            existingData = JSON.parse(data);
            let allcat = []
            existingData.forEach(element => {
                if (!allcat.includes(element.booktype)) {
                    allcat.push(element.booktype)
                }
            });
            res.render('buy.ejs', { books: existingData, catagory: allcat, expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })

        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return;
        }
    })


})
router.post("/buy/:bookname", authlogin, async (req, res) => {
    const addbookname = req.params.bookname
    const useremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: useremail })
    let cartarray = userdatas.cart
    let newobj;
    fs.readFile(jsonFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        let existingData;
        try {
            existingData = JSON.parse(data);
            const findbook = await existingData.find(book => book.bookname === addbookname);
            newobj = findbook;
            newobj['quantity'] = 1;
            const cartarr = await cartarray.find(book => book.bookname === addbookname);
            if (cartarr == undefined) {
                cartarray.push(newobj)
            }
            await StudentDb.updateOne({ email: useremail }, { $set: { cart: cartarray } })
            req.flash('expressFlash', 'Book Succesfully Added In Cart!')

            res.redirect('/cart')
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return;
        }
    })

})


module.exports = router;



