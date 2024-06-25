import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const mongoUser = {
  user: process.env.MONGODB_USER,
  password: process.env.MONGODB_PASSWORD
}
const uri = 'mongodb+srv://' + mongoUser.user + ':' + mongoUser.password + '@ethseccluster.9zokwca.mongodb.net/?retryWrites=true&w=majority&appName=EthSecCluster'

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
