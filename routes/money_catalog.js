import { Router } from 'express'
import { MoneyCatalogController } from '../controllers/money_catalog.js'

export const moneyCatalogRouter = Router()

moneyCatalogRouter.get('/', MoneyCatalogController.getAll)

moneyCatalogRouter.get('/:id', MoneyCatalogController.getById)

moneyCatalogRouter.post('/', MoneyCatalogController.create)

moneyCatalogRouter.delete('/:id', MoneyCatalogController.delete)

moneyCatalogRouter.patch('/:id', MoneyCatalogController.update)
