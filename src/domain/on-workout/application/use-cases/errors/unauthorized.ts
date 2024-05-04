import { UseCaseError } from '@/core/errors/useCaseError'

export class Unauthorized extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'Unauthorized')
  }
}
