const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/StudentDb').then(() => { console.log("Done") })
const Scema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    books: Array
})

const StudentDb = new mongoose.model("StudentDb", Scema)

module.exports = StudentDb