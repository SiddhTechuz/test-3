const mongoose = require('mongoose');
const colorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name'],
        unique: true
    },
})
const Color = mongoose.model('color', colorSchema);

module.exports = Color