const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    admin: { type: Boolean, required: false, default: false},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date
})

userSchema.methods = {
    checkPassword: function (inputPassword) {
        return bcrypt.compareSync(inputPassword, this.password)
    },
    hashPassword: plainTextPassword => {
        return bcrypt.hashSync(plainTextPassword, 10)
    }
};

userSchema.pre('save', function (next) {

    // HASH PASSWORD WHEN NEW USER CREATED
    if (!this.password) {
        console.log('models/user.js ***NO PASSWORD PROVIDED***')
        next()
    } else {
        console.log('models/user.js hashPassword in pre-save')
        this.password = this.hashPassword(this.password)
        next()
    }
});

userSchema.pre('updateOne', function (next) {

    // HASH PASSWORD IF MODIFIED
    const password = this.getUpdate().$set.password;
        if (!password) {
            return next();
        }
        try {
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            this.getUpdate().$set.password = hash;
            next();
        } catch (error) {
            return next(error);
        }

});

const User = mongoose.model('User', userSchema)

module.exports = User;