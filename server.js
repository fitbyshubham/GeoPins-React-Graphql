const {ApolloServer} = require('apollo-server')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const {findOrCreateUser} = require('./controllers/UserController')
const mongoose = require('mongoose')
require('dotenv').config()

//we can use the connect method of mongoose to connect to the cluster

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then(() => console.log('mongoose is connected'))
.catch(err => console.error(err))

//initiating this new server

const server = new ApolloServer({

    typeDefs,
    resolvers,
    context: async ({req}) => {

        let authToken = null
        let currentUser = null 
        try{
            authToken = req.headers.authorization
            if(authToken){
                //find the user in our db or create a user in db
                currentUser = await findOrCreateUser(authToken)

            }

        }catch(err){
            console.error(`Unable to authenticate user with token ${authToken}`)

        }
        return{currentUser}

    }
})

//To spin our server we will execute the listen method of it.

server.listen().then(({url}) => {
    console.log(`our server is listening on ${url}`)

})