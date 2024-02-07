import { BillingModel } from '../models/database/billings.js'
import { validateBilling, validatePartialBilling } from '../schemas/billings.js'

export class BillingController {
  static async getAll (req, res) {
    const { billingNumber } = req.query
    const billings = await BillingModel.getAll({ billingNumber })
    res.json(billings)
  }

  static async getById (req, res) {
    const { id } = req.params
    const billing = await BillingModel.getById({ id })
    if (billing) return res.json(billing)
    res.status(404).json({ message: 'Billing not found' })
  }

  static async create (req, res) {
    const { isNewBill = false } = req.query
    const result = isNewBill ? validatePartialBilling(req.body) : validateBilling(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newBilling = await BillingModel.create({ input: result.data })
    res.status(201).json(newBilling)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await BillingModel.delete({ id })
    if (!result) {
      return res.status(404).json({ message: 'Billing not found' })
    }
    return res.json({ message: 'Billing deleted' })
  }

  static async update (req, res) {
    const result = validatePartialBilling(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updatedBilling = await BillingModel.update({ id, input: result.data })
    return res.json(updatedBilling)
  }
}
