import { BillingModel } from '../models/database/billings.js'
import { validateBilling, validatePartialBilling, validateProductInfo, validatePartialProductInfo } from '../schemas/billings.js'

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
  /* eslint-disable camelcase */

  static async update (req, res) {
    const result = validatePartialBilling(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updatedBilling = await BillingModel.update({ id, input: result.data })
    return res.json(updatedBilling)
  }

  static async updateWithIgv (req, res) {
    const result = validatePartialBilling(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { with_igv = null } = result.data
    if (with_igv != null) {
      const { id } = req.params
      const updatedBillingWithIgv = await BillingModel.updateWithIgv({ id, input: result.data })
      return res.json(updatedBillingWithIgv)
    }
    return res.status(400).json({ error: 'Error updating IGV in billing controller' })
  }

  static async updateMoneyType (req, res) {
    const result = validatePartialBilling(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { money_type = null } = result.data
    if (money_type != null) {
      const { id } = req.params
      const updatedBillingMoneyType = await BillingModel.updateMoneyType({ id, input: result.data })
      return res.json(updatedBillingMoneyType)
    }
    return res.status(400).json({ error: 'Error updating money type in billing controller' })
  }

  static async addProduct (req, res) {
    const reqProduct = req.body && req.body.product
    const result = validatePartialBilling(req.body)
    const resultProduct = validateProductInfo(reqProduct)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    if (!resultProduct.success) {
      return res.status(400).json({ error: JSON.parse(resultProduct.error.message) })
    }
    const product = resultProduct.data
    if (product) {
      const { id } = req.params
      const input = {
        ...result.data,
        product
      }
      const updatedBillingProducts = await BillingModel.addProduct({ id, input })
      return res.json(updatedBillingProducts)
    }
    return res.status(400).json({ error: 'Error creating products in billing controller' })
  }

  static async modifyProductQuantity (req, res) {
    const reqProduct = req.body && req.body.product
    const result = validatePartialBilling(req.body)
    const resultProduct = validatePartialProductInfo(reqProduct)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    if (!resultProduct.success) {
      return res.status(400).json({ error: JSON.parse(resultProduct.error.message) })
    }
    const product = resultProduct.data
    if (product) {
      const { id } = req.params
      const input = {
        ...result.data,
        product
      }
      const updatedBillingProducts = await BillingModel.modifyProductQuantity({ id, input })
      return res.json(updatedBillingProducts)
    }
    return res.status(400).json({ error: 'Error updating products in billing controller' })
  }

  static async deleteProduct (req, res) {
    const reqProduct = req.body && req.body.product
    const result = validatePartialBilling(req.body)
    const resultProduct = validatePartialProductInfo(reqProduct)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    if (!resultProduct.success) {
      return res.status(400).json({ error: JSON.parse(resultProduct.error.message) })
    }
    const product = resultProduct.data
    if (product) {
      const { id } = req.params
      const input = {
        ...result.data,
        product
      }
      const resultDelete = await BillingModel.deleteProduct({ id, input })
      if (!resultDelete) {
        return res.status(404).json({ message: 'Billing product not found' })
      }
      return res.json({ message: 'Billing product deleted' })
    }
    return res.status(400).json({ error: 'Error deleting products in billing controller' })
  }

  static async generatePdf (req, res) {
    const { id } = req.params
    const billing = await BillingModel.getById({ id })
    if (!billing) {
      res.status(400).json({ error: 'Billing not found' })
    }
    const pdfBase64 = await BillingModel.generatePdf({ input: billing })
    if (!pdfBase64) return res.status(400).json({ error: 'Error creating PDF in billing controller' })
    res.json({ pdf: pdfBase64 })
  }
}
