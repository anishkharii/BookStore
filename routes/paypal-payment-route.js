const express = require('express');
const router = express.Router();
const StudentDb = require('../public/src/mongoose')
const paypal = require('paypal-rest-sdk');
let path = require("path");
let pdf = require("html-pdf");
const ejs = require('ejs');
const nodemailer = require("nodemailer");
const { error } = require('console');
const { authlogin } = require('./cookie-auth')

const jsonFilePath = './public/prapi.json';
const fs = require('fs')
async function main(mail) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "bhautikotadiya9694@gmail.com",
            pass: "omts cauf weau tzno",
        },
    });
    const info = await transporter.sendMail({
        from: 'bhautikotadiya9694@gmail.com',
        to: mail, // list of receivers
        subject: "Thank you for your order! Your product will be shipped soon!",
        text: "Hello world?",
        html: "<p>Thank For Purchasing Book From Our Shop.</p><br><p>The Purchase Book Invoice Are attached Below.</p>", // html body
        attachments: [
            {
                filename: 'invoice.pdf',
                path: "example1.pdf",
                content: 'application/pdf'
            }]
    });

}
router.get('/success', authlogin, async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const paymentuseremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: paymentuseremail })
    let totalpayable;
    userdatas.cart.forEach(async element => {
        totalpayable += element.price;
    });
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = dd + '/' + mm + '/' + yyyy;
    let randomnum = Math.random() * 100;
    let buylist = userdatas.buy
    const cartitem = userdatas.cart
    cartitem.forEach(async (ele) => {
        ele.date = formattedToday;
        buylist.push(ele)
    })
    let userdeatil = userdatas.personal_detail
    let address_detail = userdatas.address
    let newcartitem = []
    cartitem.forEach(async (ele) => {
        let seller_email = ele.selleremail
        const userdatas2 = await StudentDb.findOne({ email: seller_email })
        if (userdatas2) {
            let sell_arr = userdatas2.sell
            let firstname = userdeatil[0]['fname']
            let lastname = userdeatil[0]['lname']
            let fulladdress = address_detail[0]['area'] + ',' + address_detail[0]['landmark'] + ',' + address_detail[0]['district'] + ',' + address_detail[0]['state']
            let total = (ele.price) - ((ele.price) * (0.18))
            let obj = {
                firstname: firstname, lastname: lastname, fulladdress: fulladdress, total: total, bookname: ele.bookname, booktype: ele.booktype, quantity: ele.quantity
            }
            sell_arr.push(obj)
            const updatedata = await StudentDb.updateOne({ email: seller_email }, { $set: { sell: sell_arr } });
        }
    })

    const updatedata = await StudentDb.updateOne({ email: paymentuseremail }, { $set: { buy: buylist } });
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };
    pdata = {};
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            ejs.renderFile(('views/Example.ejs'), { paymentdata: payment, randomnumber: randomnum, invoiceData: userdatas, books: userdatas.cart, date: formattedToday }, function (err, html) {
                if (err) {
                    throw err;
                }
                let options = {
                    "height": "11.25in",
                    "width": "8.5in",
                };

                pdf.create(html, options).toFile('example1.pdf', async function (err, name) {
                    if (err) console.log(err);
                    await main(paymentuseremail)

                    console.log("PDF Created");
                });
            });
            req.flash('expressFlash', `Purchase Done SuccessFully!!`)
            res.render("sucess.ejs", { paymentdata: payment, randomnumber: randomnum, invoiceData: userdatas, books: userdatas.cart, date: formattedToday })

        }
    });



})
router.post('/payment', async (req, res) => {
    const paymentuseremail = req.cookies.userinfocookie['email']
    const userdatas = await StudentDb.findOne({ email: paymentuseremail })
    let cartItems = await userdatas.cart
    let subtotal = 0;
    for (const item of cartItems) {
        subtotal += item.price * item.quantity;
    }
    let strings = subtotal.toString()
    strings += ".00"
    fs.readFile(jsonFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        let existingData;
        try {
            existingData = JSON.parse(data);
            cartItems.forEach(async (ele) => {
                let check_book_name = ele.bookname
                let check_book_quantity = ele.quantity
                let check_exist = await existingData.find(book => book.bookname === check_book_name);
                if (ele.quantity > check_exist.quantity) {
                    req.flash('expressFlash', `Not enough quantity is available In store `)
                    res.redirect('/cart')
                }
            })
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return;
        }
    })


    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Redhock Bar Soap",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                'total': "25.00"
            },
            "description": "Washing Bar soap"
        }]
    };

    paypal.payment.create(create_payment_json, async function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});

router.get('/downloadpdf', (req, res) => {
    const pdfFilePath = './example1.pdf';
    const downloadFileName = 'invoice.pdf';
    res.download(pdfFilePath, downloadFileName, (err) => {
        if (err) {
            console.error(`Error downloading file: ${err}`);
            res.status(500).send('Error downloading the PDF.');
        }
    });
})

router.get('/cancel', (req, res) => {
    req.flash('expressFlash', `Payment Cancelled!!`)
    res.redirect('/cart')
});
module.exports = router;