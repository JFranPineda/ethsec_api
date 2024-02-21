import { Router } from 'express'
import { BillingController } from '../controllers/billings.js'

export const billingsRouter = Router()

billingsRouter.get('/', BillingController.getAll)

billingsRouter.get('/:id', BillingController.getById)

billingsRouter.post('/', BillingController.create)

billingsRouter.delete('/:id', BillingController.delete)

billingsRouter.patch('/:id', BillingController.update)

billingsRouter.patch('/:id/updateWithIgv', BillingController.updateWithIgv)

billingsRouter.patch('/:id/updateMoneyType', BillingController.updateMoneyType)

billingsRouter.patch('/:id/addProduct', BillingController.addProduct)

billingsRouter.patch('/:id/modifyProductQuantity', BillingController.modifyProductQuantity)

billingsRouter.patch('/:id/deleteProduct', BillingController.deleteProduct)

billingsRouter.get('/:id/generatePdf', BillingController.generatePdf)
