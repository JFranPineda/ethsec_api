import { ProductModel } from '../models/database/products.js'
import { validateProduct, validatePartialProduct } from '../schemas/products.js'

export class ProductController {
  static async getAll (req, res) {
    const { model } = req.query
    const products = await ProductModel.getAll({ model })
    res.json(products)
  }

  static async getById (req, res) {
    const { id } = req.params
    const product = await ProductModel.getById({ id })
    if (product) return res.json(product)
    res.status(404).json({ message: 'Product not found' })
  }

  static async create (req, res) {
    const result = validateProduct(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newProduct = await ProductModel.create({ input: result.data })
    res.status(201).json(newProduct)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await ProductModel.delete({ id })
    if (!result) {
      return res.status(404).json({ message: 'Product not found' })
    }
    return res.json({ message: 'Product deleted' })
  }

  static async update (req, res) {
    const result = validatePartialProduct(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updatedProduct = await ProductModel.update({ id, input: result.data })
    return res.json(updatedProduct)
  }
}
