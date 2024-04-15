const mongoose = require('mongoose')
const slugify = require('slugify');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name'],
        unique: true
    },
    slug: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
        // validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'A user must enterd the password'],
        minlength: 8,
        select: false
    },


},
    {
        timestamps: true
    }
)
userSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true }) + '-' + this._id;
    next();
})
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
})

//instance methods
userSchema.methods.correctPassword = async function (enteredPassword, userPassword) {
    return await bcrypt.compare(enteredPassword, userPassword)
}


const User = mongoose.model('user', userSchema)
module.exports = User;
