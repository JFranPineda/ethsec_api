import express, { json } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { productsRouter } from '../routes/products.js'
import { clientsRouter } from '../routes/clients.js'
import { sellersRouter } from '../routes/sellers.js'
import { moneyCatalogRouter } from '../routes/money_catalog.js'
import { billingsRouter } from '../routes/billings.js'
import { corsMiddleware } from '../middlewares/cors.js'
import serverless from 'serverless-http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use('/public', express.static(path.join(__dirname, '../public')))

app.use('/products', productsRouter)
app.use('/clients', clientsRouter)
app.use('/sellers', sellersRouter)
app.use('/money_catalog', moneyCatalogRouter)
app.use('/billings', billingsRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Not Foundddd' })
})

const handler = serverless(app)

export { handler }
