import { UseCaseError } from '@/core/errors/useCaseError'

export class Conflict extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'Conflict Error')
  }
}
