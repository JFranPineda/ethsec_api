import express, { json } from 'express'
import { productsRouter } from './routes/products.js'
import { clientsRouter } from './routes/clients.js'
import { sellersRouter } from './routes/sellers.js'
import { moneyCatalogRouter } from './routes/money_catalog.js'
import { billingsRouter } from './routes/billings.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

app.use('/products', productsRouter)
app.use('/clients', clientsRouter)
app.use('/sellers', sellersRouter)
app.use('/money_catalog', moneyCatalogRouter)
app.use('/billings', billingsRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
