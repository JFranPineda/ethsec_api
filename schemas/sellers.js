import z from 'zod'

const sellerSchema = z.object({
  first_name: z.string({
    invalid_type_error: 'First name must be a string',
    required_error: 'First name is required.'
  }),
  last_name: z.string({
    invalid_type_error: 'Last name must be a string',
    required_error: 'Last name is required.'
  }),
  telephone: z.string(),
  email: z.string().email({
    invalid_type_error: 'Please enter a valid email address',
    required_error: 'Email is required.'
  })
})

export function validateSeller (input) {
  return sellerSchema.safeParse(input)
}

export function validatePartialSeller (input) {
  return sellerSchema.partial().safeParse(input)
}
