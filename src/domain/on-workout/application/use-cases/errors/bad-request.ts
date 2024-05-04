import { UseCaseError } from '@/core/errors/useCaseError'

export class BadRequest extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'Bad request')
  }
}
