import z from 'zod'

const productInfoSchema = z.object({
  _id: z.string(),
  item: z.string(),
  description: z.string(),
  model: z.string({
    invalid_type_error: 'Model must be a string',
    required_error: 'Model is required.'
  }),
  reserved_quantity: z.number().int().min(0).max(1000).default(1),
  unit_price: z.number().min(0).max(99999).default(0),
  price_non_igv: z.number().min(0).max(99999).default(0),
  price_igv: z.number().min(0).max(99999).default(0),
  price_pen_non_igv: z.number().min(0).max(99999).default(0),
  price_pen_igv: z.number().min(0).max(99999).default(0),
  total: z.number().min(0).max(99999).default(0)
})

const billingSchema = z.object({
  client_id: z.string({
    invalid_type_error: 'Please select a valid client',
    required_error: 'Client ID is required.'
  }),
  company_id: z.string({
    invalid_type_error: 'Please select a valid company',
    required_error: 'Company ID is required.'
  }),
  billing_number: z.string(),
  seller_id: z.string({
    invalid_type_error: 'Please select a valid seller',
    required_error: 'Seller ID is required.'
  }),
  money_type: z.string({
    invalid_type_error: 'Please select a valid money type',
    required_error: 'Money type is required.'
  }),
  with_igv: z.boolean({
    invalid_type_error: 'with_igv must be a boolean',
    required_error: 'with_igv is required'
  }),
  before_taxes_amount: z.number().min(0).default(0),
  igv_amount: z.number().min(0).default(0),
  total_amount: z.number().min(0).default(0),
  notes: z.string(),
  expiration_time: z.number().min(0).default(0),
  products: z.array(productInfoSchema,
    {
      required_error: 'Product(s) are required.',
      invalid_type_error: 'Movie genre must be an array of product schema {item, description, model, quantity, unit_price, total}'
    }
  )
})

export function validateBilling (input) {
  return billingSchema.safeParse(input)
}

export function validatePartialBilling (input) {
  return billingSchema.partial().safeParse(input)
}

export function validatePartialProductInfo (input) {
  return productInfoSchema.partial().safeParse(input)
}
