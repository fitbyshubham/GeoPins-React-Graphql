const User = require('../models/User')

// library which will enable us to verify the id token

const {OAuth2Client} = require('google-auth-library')

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)

//function which will contain the logic to find the user or create a user in db

exports.findOrCreateUser = async token => {
//verify auth token
const googleUser = await verifyAuthToken(token)
//check if the user exist
const user = await checkIfUserExist(googleUser.email)
//if user exists, return them; otherwise create a new user in db
return user?user : createNewUser(googleUser)
}

const verifyAuthToken = async token => {

    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID
        })
        return ticket.getPayload()

    }catch(err){
console.err("Error verifying auth token", err)
    }

}

const checkIfUserExist = async email => {
    await User.findOne({
        email
    }).exec()
} 

const createNewUser = googleUser => {
    const {
        name, email, picture 
    } = googleUser

    const user = {name, email, picture}
    return new User(user).save()

    // Here to persist our value to the db we are using save method.
}