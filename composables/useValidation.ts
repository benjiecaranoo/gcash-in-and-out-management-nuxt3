import { required } from '@vuelidate/validators'

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
    minAmount: (fieldName: string, min: number) => ({
      $validator: (v: number) => v > 0,
      $message: `${fieldName} must be greater than 0`
    }),
    phoneFormat: (fieldName: string) => ({
      $validator: (v: string) => /^09\d{9}$/.test(v.toString()),
      $message: ` ${fieldName} must be a valid (e.g., 09123456789)`
    }),
    numeric: (fieldName: string) => ({
      $validator: (v: any) => !isNaN(v),
      $message: `${fieldName} must be a number`
    })
  }

  return {
    validations
  }
}