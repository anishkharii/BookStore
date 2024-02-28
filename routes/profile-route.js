const express = require('express');
const router = express.Router();
const { authlogin } = require('./cookie-auth')
const StudentDb = require('../public/src/mongoose')


router.get('/profile', authlogin, async (req, res) => {
    const useremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: useremail })
    let personal_detail = userdatas.personal_detail


    res.render('profile.ejs', { expressFlash: req.flash('expressFlash'), personal_detail: personal_detail, useremail: useremail, class_name: 'info-massage' })
})
router.get('/address', authlogin, async (req, res) => {
    const useremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: useremail })
    let address_arr = userdatas.address

    res.render('address.ejs', { expressFlash: req.flash('expressFlash'), address_arr: address_arr, class_name: 'info-massage' })
})
router.get('/orderhistory', authlogin, async (req, res) => {

    res.render('orderhistory.ejs', { expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
})

router.get('/buyhistory', authlogin, async (req, res) => {
    const cartviewuseremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: cartviewuseremail })
    const buyarr = userdatas.buy
    res.render('buyhistory.ejs', { buyarr: buyarr, expressFlash: req.flash('expressFlash'), class_name: 'info-massage' })
})
router.get('/sellhistory', authlogin, async (req, res) => {

    const cartviewuseremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: cartviewuseremail })
    const sell = userdatas.sell
    res.render('sellhistory.ejs', { expressFlash: req.flash('expressFlash'), class_name: 'info-massage', sell: sell })
})
router.post('/name-info', async (req, res) => {
    const useremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: useremail })
    fname = req.body.first_name
    lname = req.body.last_name
    birthdate = req.body.birthdatdate
    phonenumber = req.body.phonenumber
    let Personal_info = { fname: fname, lname: lname, birthdate: birthdate, phonenumber: parseInt(phonenumber) }
    let personal_arr = []
    personal_arr.push(Personal_info)
    const updatedata = await StudentDb.updateOne({ email: useremail }, { $set: { personal_detail: personal_arr } });
    res.redirect('/profile')
})

router.post('/useraddress', async (req, res) => {
    const useremail = req.cookies.userinfocookie['email']

    fname = req.body.first_name
    phone_number = req.body.phone_number
    pincode = req.body.pincode
    locality = req.body.locality
    area = req.body.area
    district = req.body.district
    landmark = req.body.landmark
    alternate_number = req.body.alternate_number
    state = req.body.state
    address_arr = []
    let allpushdetail = { first_name: fname, phone_number: phone_number, pincode: pincode, locality: locality, area: area, district: district, landmark: landmark, alternate_number: alternate_number, state: state }
    address_arr.push(allpushdetail)

    const updatedata = await StudentDb.updateOne({ email: useremail }, { $set: { address: address_arr } });
    res.redirect('/')
})

module.exports = router
