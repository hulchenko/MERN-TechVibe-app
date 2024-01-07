import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // bool
};

userSchema.pre('save', async function (next) { // .pre middleware fires before new object gets created in DB
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10); // generate salt to encrypt the password
    this.password = await bcrypt.hash(this.password, salt); //replace user created password with the bcrypted version
});

const User = mongoose.model("User", userSchema);

export default User;