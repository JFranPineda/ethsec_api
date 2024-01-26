import z from 'zod'

const clientSchema = z.object({
  ruc: z.string({
    invalid_type_error: 'RUC must be a string',
    required_error: 'RUC is required.'
  }),
  company_name: z.string(),
  contact: z.string(),
  address: z.string(),
  city: z.string(),
  telephone: z.string(),
  email: z.string().email({
    invalid_type_error: 'Please enter a valid email address',
    required_error: 'Email is required.'
  })
})

export function validateClient (input) {
  return clientSchema.safeParse(input)
}

export function validatePartialClient (input) {
  return clientSchema.partial().safeParse(input)
}
