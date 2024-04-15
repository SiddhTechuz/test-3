const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name'],
    },
    slug: {
        type: String,
        unique: true
    },
    image: {
        type: String
    },
    quantity: {
        type: Number,
        required: [true, 'Please Enter Quantity'],
    },
    price: {
        type: Number,
        required: [true, 'Please Enter Price'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A product must belong to a owner']
    },

}, {
    timestamps: true
})
productSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true }) + '-' + this._id;
    next();
})
const Product = mongoose.model('product', productSchema);

module.exports = Product