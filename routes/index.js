const express = require('express');
const router = express.Router();
var flash = require('connect-flash');


router.get('/', (req, res) => {

    res.redirect('/home')
})
router.get('/home', (req, res) => {
    res.render('index.ejs', { expressFlash: req.flash('expressFlash'), class_name: 'info-massage' });
})
router.get('/contactus', (req, res) => {
    res.render('contactus.ejs', { expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
})

router.get('/policy', (req, res) => {
    res.render('policy.ejs', { expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
})
router.get('/forgot', (req, res) => {
    res.render('forgot.ejs', { expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
})

module.exports = router;