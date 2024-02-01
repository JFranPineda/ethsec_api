import z from 'zod'

const productSchema = z.object({
  model: z.string({
    invalid_type_error: 'Model must be a string',
    required_error: 'Model is required.'
  }),
  description: z.string(),
  quantity: z.number().int().min(0).max(1000).default(1),
  price_non_igv: z.number().min(0).max(99999).default(1000),
  price_igv: z.number().min(0).max(99999).default(1180),
  price_pen_non_igv: z.number().min(0).max(99999).default(1000),
  price_pen_igv: z.number().min(0).max(99999).default(1180)
})

export function validateProduct (input) {
  return productSchema.safeParse(input)
}

export function validatePartialProduct (input) {
  return productSchema.partial().safeParse(input)
}
