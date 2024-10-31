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
    })
  }

  return {
    validations
  }
}