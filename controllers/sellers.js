import { SellerModel } from '../models/database/sellers.js'
import { validateSeller, validatePartialSeller } from '../schemas/sellers.js'

export class SellerController {
  static async getAll (req, res) {
    const { firstName } = req.query
    const sellers = await SellerModel.getAll({ firstName })
    res.json(sellers)
  }

  static async getById (req, res) {
    const { id } = req.params
    const seller = await SellerModel.getById({ id })
    if (seller) return res.json(seller)
    res.status(404).json({ message: 'Seller not found' })
  }

  static async create (req, res) {
    const result = validateSeller(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newSeller = await SellerModel.create({ input: result.data })
    res.status(201).json(newSeller)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await SellerModel.delete({ id })
    if (!result) {
      return res.status(404).json({ message: 'Seller not found' })
    }
    return res.json({ message: 'Seller deleted' })
  }

  static async update (req, res) {
    const result = validatePartialSeller(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updatedSeller = await SellerModel.update({ id, input: result.data })
    return res.json(updatedSeller)
  }
}
