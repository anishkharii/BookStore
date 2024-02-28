const StudentDb = require('./mongoose')
const multer = require('multer')
const upload = multer({ dest: "/public/uploads" })
const fs = require('fs')
let imgpath;
const jsonFilePath = './public/prapi.json';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/uploads')
    },
    filename: async function (req, file, cb) {
        imgpath = `${Date.now()}-${file.originalname}`
        const useremail = req.cookies.userinfocookie['email']
        const userbookinfo = { bookname: req.body.bookname, price: req.body.price, authorname: req.body.authorname, imgpath: imgpath, selleremail: useremail, booktype: req.body.booktype, quantity: req.body.quantity }
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
            existingData.push(userbookinfo);

            fs.writeFile(jsonFilePath, JSON.stringify(existingData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to JSON file:', writeErr);
                    return;
                }
                console.log('New data added to the JSON file.');
            });
        });

        return cb(null, imgpath)
    }
})
const uploads = multer({ storage })
module.exports = uploads