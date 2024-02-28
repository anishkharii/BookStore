const { authlogin } = require('./cookie-auth')
const express = require('express');
const router = express.Router();
const StudentDb = require('../public/src/mongoose')
const jsonFilePath = './public/review.json';
const fs = require('fs')
router.get('/review', authlogin, async (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        let existingData;
        try {
            existingData = JSON.parse(data);

            res.render('review.ejs', { reviewarr: existingData, expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })

        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return;
        }
    })

})
router.post('/review/submit', authlogin, async (req, res) => {
    const useremail = req.cookies.userinfocookie['email']
    var date = new Date();
    var formatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' });
    var formattedDate = formatter.format(date);
    const d = new Date();
    let year = d.getFullYear();
    formattedDate += `, ${year}`
    const usereviewinfo = { username: req.body.username, email: req.body.useremail, rating: req.body.rating, reviewmsg: req.body.reviewtext, date: formattedDate }
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        let existingData;
        try {
            existingData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return;
        }
        existingData.push(usereviewinfo);

        fs.writeFile(jsonFilePath, JSON.stringify(existingData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing to JSON file:', writeErr);
                return;
            }
            console.log('New data added to the JSON file.');
        });
    });

    req.flash('expressFlash', `Review Succesfully Submited!!`)

    res.redirect('/review')
})

module.exports = router;