import z from 'zod'

const moneyCatalogSchema = z.object({
  currency: z.string({
    invalid_type_error: 'Currency must be a string',
    required_error: 'Currency is required.'
  }),
  symbol: z.string({
    invalid_type_error: 'Symbol must be a string',
    required_error: 'Symbol is required.'
  }),
  description: z.string().min(5),
  exchange_value: z.number().min(0)
})

export function validateMoneyCatalog (input) {
  return moneyCatalogSchema.safeParse(input)
}

export function validatePartialMoneyCatalog (input) {
  return moneyCatalogSchema.partial().safeParse(input)
}
