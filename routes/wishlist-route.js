const express = require('express');
const router = express.Router();
const { authlogin } = require('./cookie-auth')
const StudentDb = require('../public/src/mongoose')
const jsonFilePath = './public/prapi.json';
const fs = require('fs')
router.get('/wishlist', authlogin, async (req, res) => {
    const wishlistuseremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: wishlistuseremail })
    const findwishlistarray = await userdatas.wishlist
    res.render('wishlist.ejs', { wishlistarr: findwishlistarray, expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
})
router.get('/wishlist/:bookname', async (req, res) => {
    const wishlistaddbookname = req.params.bookname;
    const useremail = req.cookies.userinfocookie['email']
    const finddata = await StudentDb.findOne({ email: useremail })
    let newwishlistarray = finddata.wishlist
    fs.readFile(jsonFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        let existingData;
        try {
            existingData = JSON.parse(data);
            const findbook = await existingData.find(book => book.bookname === wishlistaddbookname);
            newobj = findbook;
            const cartarr = await newwishlistarray.find(book => book.bookname === wishlistaddbookname);
            if (cartarr == undefined) {
                newwishlistarray.push(newobj)
            }
            await StudentDb.updateOne({ email: useremail }, { $set: { wishlist: newwishlistarray } })
            req.flash('expressFlash', `Book Added in Wishlist!`)

            res.redirect('/wishlist')
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return;
        }
    })
})
router.get('/wishlist/remove/:bookname', authlogin, async (req, res) => {
    const removebookname = req.params.bookname
    const removeuseremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: removeuseremail })
    let findcartarray = await userdatas.wishlist
    for (let index = 0; index < findcartarray.length; index++) {
        if (findcartarray[index].bookname == removebookname) {
            findcartarray.splice(index, 1);
        }
    }
    const updatedata = await StudentDb.updateOne({ email: removeuseremail }, { $set: { wishlist: findcartarray } });
    req.flash('expressFlash', `Book Deleted From Wishlist!!`)

    res.redirect('/wishlist')


})
module.exports = router