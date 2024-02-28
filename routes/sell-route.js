const { authlogin } = require('./cookie-auth')
const StudentDb = require('../public/src/mongoose')
const fs = require('fs')

const jsonFilePath = './public/prapi.json';
const express = require('express');
const router = express.Router();
router.get('/sell', authlogin, async (req, res) => {
    const email = req.cookies.userinfocookie.email
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        let existingData;
        try {
            existingData = JSON.parse(data);
            let bookarr = []
            existingData.forEach(element => {
                if (element.selleremail == email) {
                    bookarr.push(element)
                }
            });
            if (bookarr.length == 0) {
                res.render('sell.ejs', { nobooksmsg: "No Books", expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
            } else {
                res.render('sell.ejs', { books: bookarr, expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
            }

        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return;
        }
    })


})
module.exports = router;