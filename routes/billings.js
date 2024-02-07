import { Router } from 'express'
import { BillingController } from '../controllers/billings.js'

export const billingsRouter = Router()

billingsRouter.get('/', BillingController.getAll)

billingsRouter.get('/:id', BillingController.getById)

billingsRouter.post('/', BillingController.create)

billingsRouter.delete('/:id', BillingController.delete)

billingsRouter.patch('/:id', BillingController.update)