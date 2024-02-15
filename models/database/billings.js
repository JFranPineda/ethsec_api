import { ObjectId } from 'mongodb'
import { client } from './connect.js'
import { calculateBillingAmounts, calculateNewProducts, deleteBillingProduct, updateProductQuantity, updateProductsByIgvAndMoney } from '../utils.js'

async function connect () {
  try {
    await client.connect()
    const database = client.db('ethsec_billing')
    return database.collection('billings')
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  }
}

export class BillingModel {
  static async getAll ({ billingNumber }) {
    const db = await connect()
    if (billingNumber) {
      return db.find({ billingNumber }).toArray()
    }
    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connect()
    if (ObjectId.isValid(id)) {
      const objectId = new ObjectId(id)
      return await db.findOne({ _id: objectId })
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
    if (ObjectId.isValid(id)) {
      const objectId = new ObjectId(id)
      const { deletedCount } = await db.deleteOne({ _id: objectId })
      return deletedCount > 0
    }
    return false
  }

  static async update ({ id, input }) {
    const db = await connect()
    if (ObjectId.isValid(id)) {
      const objectId = new ObjectId(id)
      const { ok, value } = await db.findOneAndUpdate(
        { _id: objectId },
        { $set: input },
        {
          returnDocument: 'after',
          includeResultMetadata: true
        }
      )
      if (!ok) return false
      return value
    }
    return false
  }
  /* eslint-disable camelcase */

  static async updateWithIgv ({ id, input }) {
    const db = await connect()
    if (!ObjectId.isValid(id)) return false
    const objectId = new ObjectId(id)
    const billingToUpdate = await this.getById({ id })
    const { products = [], money_type } = billingToUpdate
    const { with_igv } = input
    const newProducts = updateProductsByIgvAndMoney({ products, money_type, with_igv })
    const billingAmounts = calculateBillingAmounts({ products: newProducts, with_igv })
    const { ok, value } = await db.findOneAndUpdate(
      { _id: objectId },
      [
        { $set: billingAmounts },
        { $set: { products: newProducts } },
        { $set: { with_igv } },
        { $set: { money_type } }
      ],
      {
        returnDocument: 'after',
        includeResultMetadata: true
      }
    )
    if (!ok) return false
    return value
  }

  static async updateMoneyType ({ id, input }) {
    const db = await connect()
    if (!ObjectId.isValid(id)) return false
    const objectId = new ObjectId(id)
    const billingToUpdate = await this.getById({ id })
    const { products = [], with_igv } = billingToUpdate
    const { money_type } = input
    const newProducts = updateProductsByIgvAndMoney({ products, money_type, with_igv })
    const billingAmounts = calculateBillingAmounts({ products: newProducts, with_igv })
    const { ok, value } = await db.findOneAndUpdate(
      { _id: objectId },
      [
        { $set: billingAmounts },
        { $set: { products: newProducts } },
        { $set: { with_igv } },
        { $set: { money_type } }
      ],
      {
        returnDocument: 'after',
        includeResultMetadata: true
      }
    )
    if (!ok) return false
    return value
  }

  static async addProduct ({ id, input }) {
    const db = await connect()
    if (!ObjectId.isValid(id)) return false
    const objectId = new ObjectId(id)
    const billingToUpdate = await this.getById({ id })
    const { products = [], with_igv, money_type } = billingToUpdate
    const { product } = input
    const newProducts = calculateNewProducts({ products, with_igv, money_type, product })
    const billingAmounts = calculateBillingAmounts({ products: newProducts, with_igv })
    const { ok, value } = await db.findOneAndUpdate(
      { _id: objectId },
      [
        { $set: billingAmounts },
        { $set: { products: newProducts } }
      ],
      {
        returnDocument: 'after',
        includeResultMetadata: true
      }
    )
    if (!ok) return false
    return value
  }

  static async modifyProductQuantity ({ id, input }) {
    const db = await connect()
    if (!ObjectId.isValid(id)) return false
    const objectId = new ObjectId(id)
    const billingToUpdate = await this.getById({ id })
    const { products = [], with_igv } = billingToUpdate
    const { product } = input
    const newProducts = updateProductQuantity({ products, product })
    const billingAmounts = calculateBillingAmounts({ products: newProducts, with_igv })
    const { ok, value } = await db.findOneAndUpdate(
      { _id: objectId },
      [
        { $set: billingAmounts },
        { $set: { products: newProducts } }
      ],
      {
        returnDocument: 'after',
        includeResultMetadata: true
      }
    )
    if (!ok) return false
    return value
  }

  static async deleteProduct ({ id, input }) {
    const db = await connect()
    if (!ObjectId.isValid(id)) return false
    const objectId = new ObjectId(id)
    const billingToUpdate = await this.getById({ id })
    const { products = [], with_igv } = billingToUpdate
    const { product } = input
    const newProducts = deleteBillingProduct({ products, product })
    const billingAmounts = calculateBillingAmounts({ products: newProducts, with_igv })
    if (newProducts.length === products.length) return false
    const { ok, value } = await db.findOneAndUpdate(
      { _id: objectId },
      [
        { $set: billingAmounts },
        { $set: { products: newProducts } }
      ],
      {
        returnDocument: 'after',
        includeResultMetadata: true
      }
    )
    if (!ok) return false
    return value
  }
}
