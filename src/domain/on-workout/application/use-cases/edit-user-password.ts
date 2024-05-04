import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user.repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from './errors/resource-not-found'
import { compare } from 'bcryptjs'
import { BadRequest } from './errors/bad-request'
import { Unauthorized } from './errors/unauthorized'

interface EditUserPasswordUseCaseRequest {
  userId: string
  currentUserId: string
  newPassword: string
  oldPassword: string
}

type EditUserPasswordUseCaseResponse = Either<
  ResourceNotFound | BadRequest,
  { user: User }
>

export class EditUserPasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
    currentUserId,
    newPassword,
    oldPassword,
  }: EditUserPasswordUseCaseRequest): Promise<EditUserPasswordUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFound())
    }

    if (userId !== currentUserId) return left(new Unauthorized())

    const passwordMatch = await compare(oldPassword, user.password)

    if (!passwordMatch) {
      return left(new BadRequest('Old password does not match.'))
    }

    user.password = newPassword

    await this.userRepository.save(user)

    return right({
      user,
    })
  }
}
