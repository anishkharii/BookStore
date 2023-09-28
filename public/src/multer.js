const StudentDb = require('./mongoose')
const multer = require('multer')
const upload = multer({ dest: "/public/uploads" })
let imgpath;
let booklist = []
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/uploads')
    },
    filename: async function (req, file, cb) {
        imgpath = `${Date.now()}-${file.originalname}`
        const useremail = req.cookies.userinfocookie['email']
        const userdatas = await StudentDb.findOne({ email: useremail })
        const userbookinfo = { bookname: req.body.bookname, price: req.body.price, authorname: req.body.authorname, imgpath: imgpath }
        const books = userdatas.books
        books.push(userbookinfo)
        const appendbook = await StudentDb.updateOne({ email: useremail }, { $set: { books: books } })
        console.log(appendbook)
        return cb(null, imgpath)
    }
})
const uploads = multer({ storage })


module.exports = uploads