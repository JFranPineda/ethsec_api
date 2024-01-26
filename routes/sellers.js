import { Router } from 'express'
import { SellerController } from '../controllers/sellers.js'

export const sellersRouter = Router()

sellersRouter.get('/', SellerController.getAll)

sellersRouter.get('/:id', SellerController.getById)

sellersRouter.post('/', SellerController.create)

sellersRouter.delete('/:id', SellerController.delete)

sellersRouter.patch('/:id', SellerController.update)
