import { ClientModel } from '../models/database/clients.js'
import { validateClient, validatePartialClient } from '../schemas/clients.js'

export class ClientController {
  static async getAll (req, res) {
    const { ruc } = req.query
    const clients = await ClientModel.getAll({ ruc })
    res.json(clients)
  }

  static async getById (req, res) {
    const { id } = req.params
    const client = await ClientModel.getById({ id })
    if (client) return res.json(client)
    res.status(404).json({ message: 'Client not found' })
  }

  static async create (req, res) {
    const result = validateClient(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newClient = await ClientModel.create({ input: result.data })
    res.status(201).json(newClient)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await ClientModel.delete({ id })
    if (!result) {
      return res.status(404).json({ message: 'Client not found' })
    }
    return res.json({ message: 'Client deleted' })
  }

  static async update (req, res) {
    const result = validatePartialClient(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updatedClient = await ClientModel.update({ id, input: result.data })
    return res.json(updatedClient)
  }
}
