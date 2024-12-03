import { helpers } from '@vuelidate/validators'

export function useValidation() {
  const validations = {
    required: (fieldName: string) => ({
      $validator: (v: any) => !!v,
      $message: `${fieldName} is required`
    }),
    minLength: (fieldName: string, min: number) => ({
      $validator: (v: string) => v.length >= min,
      $message: `${fieldName} must be at least ${min} characters`
    }),
    email: () => ({
      $validator: (v: string) => /.+@.+\..+/.test(v),
      $message: 'Must be a valid email'
    }),
    sameAs: (fieldName: string, otherField: string) => ({
      $validator: (v: string, formData: any) => v === formData[otherField],
      $message: `${fieldName} must match ${otherField}`
    }),
    minAmount: (v: number) => v > 0 || 'Amount must be greater than 0',
    phone: (v: string) => /^09\d{9}$/.test(v) || 'Must be a valid phone number (e.g., 09123456789)',
    number: (v: any) => !isNaN(v) || 'Must be a number',
  }

  return {
    validations
  }
}