const express = require('express');
const router = express.Router();
const uploads = require('../public/src/multer')

router.post('/addbook', uploads.single('inputimg'), async (req, res) => {
    req.flash('expressFlash', 'Book Succesfully Added For Sell!')

    res.redirect('/sell')
})

module.exports = router