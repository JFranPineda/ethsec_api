import { MoneyCatalogModel } from '../models/database/money_catalog.js'
import { validateMoneyCatalog, validatePartialMoneyCatalog } from '../schemas/money_catalog.js'

export class MoneyCatalogController {
  static async getAll (req, res) {
    const { currency } = req.query
    const moneyCatalogs = await MoneyCatalogModel.getAll({ currency })
    res.json(moneyCatalogs)
  }

  static async getById (req, res) {
    const { id } = req.params
    const moneyCatalog = await MoneyCatalogModel.getById({ id })
    if (moneyCatalog) return res.json(moneyCatalog)
    res.status(404).json({ message: 'Money Type not found' })
  }

  static async create (req, res) {
    const result = validateMoneyCatalog(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMoneyCatalog = await MoneyCatalogModel.create({ input: result.data })
    res.status(201).json(newMoneyCatalog)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await MoneyCatalogModel.delete({ id })
    if (!result) {
      return res.status(404).json({ message: 'Money Type not found' })
    }
    return res.json({ message: 'Money Type deleted' })
  }

  static async update (req, res) {
    const result = validatePartialMoneyCatalog(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updatedMoneyCatalog = await MoneyCatalogModel.update({ id, input: result.data })
    return res.json(updatedMoneyCatalog)
  }
}
