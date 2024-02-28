const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL).then(() => { console.log("Done") })


// mongoose.connect(process.env.MONGO_URL).then(() => { console.log("Done") })


const Scema = new mongoose.Schema({
    username: String,
    googleid: String,
    email: String,
    password: String,
    token: String,
    books: Array,
    cart: Array,
    address: Array,
    buy: Array,
    sell: Array,
    order: Array,
    wishlist: Array,
    personal_detail: Array,
})

const StudentDb = new mongoose.model("StudentDb", Scema)

module.exports = StudentDb