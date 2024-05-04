import { UseCaseError } from '@/core/errors/useCaseError'

export class ResourceNotFound extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'Resource not found')
  }
}
