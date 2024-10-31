import { email, helpers, maxLength, minLength, required, sameAs } from '@vuelidate/validators';

const password = (value: string) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(value);
export const validations = {
    email: () => helpers.withMessage(() => `Must be a valid email address`, email),
    required: (label: string) => helpers.withMessage(() => `${label} is required`, required),
    minLength: (label: string, min: number) => helpers.withMessage(({ $params }) => `${label} should be at least ${$params.min} characters long`, minLength(min)),
    maxLength: (label: string, min: number) => helpers.withMessage(({ $params }) => `${label} must be no more than ${$params.max} characters long`, maxLength(min)),
    sameAs: (label: string, sameAsLabel: string, newPassword: string | number,confirmPassword: string | number) => {
        const validation = newPassword === confirmPassword;
        return {
            isValid: validation,
            message: validation ? '' : `${label} must be equal to ${sameAsLabel}`,
        };
    },
    password: () =>
        helpers.withMessage(
          () => `The Password must contain at least one uppercase and lowercase letter, digit, and special character`,
          password
        ),
}

export function useValidation() {
  return {
    validations,
  };
}