const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    title: String,
    price: Number,
    userID: String,
    image: String,
    category: {type: String, enum: ["iPhone", "iPad", "Watch", "Mac"]}

},{
    versionKey: false
})
const ProductModel = mongoose.model("note", productSchema)


module.exports = {
    ProductModel
}