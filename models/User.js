const mongoose = require('mongoose')

// First we will create our schema using mongoose schema constructor

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    picture: String
})

//we are not passing id as it will automatically gernerated by our db when we are creating a new user entry.

module.exports = mongoose.model("User", UserSchema)