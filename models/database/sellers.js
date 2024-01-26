import { ObjectId } from 'mongodb'
import { client } from './connect.js'

async function connect () {
  try {
    await client.connect()
    const database = client.db('ethsec_billing')
    return database.collection('sellers')
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  }
}

export class SellerModel {
  static async getAll ({ firstName }) {
    const db = await connect()
    if (firstName) {
      return db.find({ first_name: firstName }).toArray()
    }
    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connect()
    if (ObjectId.isValid(id)) {
      const objectId = new ObjectId(id)
      return db.findOne({ _id: objectId })
    }
    return {}
  }

  static async create ({ input }) {
    const db = await connect()
    const { insertedId } = await db.insertOne(input)
    return {
      id: insertedId,
      ...input
    }
  }

  static async delete ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }

  static async update ({ id, input }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    const { ok, value } = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnNewDocument: true })

    if (!ok) return false

    return value
  }
}
