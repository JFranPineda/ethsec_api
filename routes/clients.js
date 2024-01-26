import { Router } from 'express'
import { ClientController } from '../controllers/clients.js'

export const clientsRouter = Router()

clientsRouter.get('/', ClientController.getAll)

clientsRouter.get('/:id', ClientController.getById)

clientsRouter.post('/', ClientController.create)

clientsRouter.delete('/:id', ClientController.delete)

clientsRouter.patch('/:id', ClientController.update)
