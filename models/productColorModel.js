const mongoose = require('mongoose');

const productcolorSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    },
    colorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Color'
    },
})
const ProductColor = mongoose.model('productcolor', productcolorSchema);

module.exports = ProductColor