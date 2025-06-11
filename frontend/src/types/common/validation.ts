// types/validation.ts
export interface FieldError {
  field: string
  defaultMessage: string
}

export interface ValidationErrorResponse {
  errors: FieldError[]
}
