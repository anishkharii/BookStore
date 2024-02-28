const express = require('express');
const router = express.Router();
const { authlogin } = require('./cookie-auth')
const StudentDb = require('../public/src/mongoose')
const jsonFilePath = './public/prapi.json';
const fs = require('fs')
router.get('/delete/:params1', authlogin, async (req, res) => {
    const deletebookname = req.params.params1
    const deleteuseremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: deleteuseremail })
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        let existingData;
        try {
            existingData = JSON.parse(data);
            console.log(existingData)
            for (let index = 0; index < existingData.length; index++) {
                if (existingData[index].bookname == deletebookname) {
                    existingData.splice(index, 1);
                }
            }
            req.flash('expressFlash', 'Book Deleted!')

            res.redirect('/sell')

        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return;
        }
        fs.writeFile(jsonFilePath, JSON.stringify(existingData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing to JSON file:', writeErr);
                return;
            }
            console.log('New data added to the JSON file.');
        });
    })
})
router.post('/update/:bookname', authlogin, async (req, res) => {
    const updatebookname = req.params.bookname
    const updateuseremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: updateuseremail })
    let findbook = await userdatas.books
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        let updatebook = [];

        const config = JSON.parse(data);
        config.forEach(element => {
            if (element.bookname == updatebookname) {
                updatebook.push(element)
            }
        });
        res.render('edit_book.ejs', { expressFlash: req.flash('expressFlash'), class_name: 'info-massage', bookname: updatebookname, bookdetail: updatebook })
    });
})
router.post('/update/data/:bookname', authlogin, async (req, res) => {
    const updatebookname = req.params.bookname
    const updateuseremail = req.cookies.userinfocookie['email']

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        let findex;


        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        let existingData;
        try {
            existingData = JSON.parse(data);
            for (let index = 0; index < existingData.length; index++) {
                if (existingData[index].bookname == updatebookname) {
                    findex = index;
                }
            }
            let updatebook = req.body.bookname
            let updatebookprice = req.body.price
            let updatebookquantity = req.body.quantity
            let updatebooktype = req.body.booktype
            let updatebookauthorname = req.body.authorname
            if (updatebook.length == 0) {
                updatebook = existingData[findex].bookname
            }
            if (updatebookprice.length == 0) {
                updatebookprice = existingData[findex].price
            }
            if (updatebookauthorname.length == 0) {
                updatebookauthorname = existingData[findex].authorname
            }
            if (updatebookquantity.length == 0) {
                updatebookquantity = existingData[findex].quantity
            }
            if (updatebooktype == 'none') {
                updatebooktype = existingData[findex].booktype
            }
            existingData[findex].bookname = updatebook;
            existingData[findex].price = updatebookprice;
            existingData[findex].authorname = updatebookauthorname;
            existingData[findex].quantity = updatebookquantity;
            existingData[findex].booktype = updatebooktype;

        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return;
        }
        fs.writeFile(jsonFilePath, JSON.stringify(existingData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing to JSON file:', writeErr);
                return;
            }
            console.log('New data added to the JSON file.');
        });
        req.flash('expressFlash', 'Book Detail Succesfully Updated!')

        res.redirect('/sell')

    })

})
module.exports = router