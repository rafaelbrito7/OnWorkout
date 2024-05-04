import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user.repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from './errors/resource-not-found'
import { Unauthorized } from './errors/unauthorized'
import { UserProfileRepository } from '../repositories/user-profile.repository'

interface EditUserAvatarUseCaseRequest {
  userId: string
  currentUserId: string
  avatar: string
}

type EditUserAvatarUseCaseResponse = Either<
  ResourceNotFound | Unauthorized,
  { user: User }
>

export class EditUserAvatarUseCase {
  constructor(
    private userRepository: UserRepository,
    private userProfileRepository: UserProfileRepository,
  ) {}

  async execute({
    userId,
    currentUserId,
    avatar,
  }: EditUserAvatarUseCaseRequest): Promise<EditUserAvatarUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFound('User not found.'))
    }

    if (userId !== currentUserId) return left(new Unauthorized())

    const userProfile = await this.userProfileRepository.findByUserId(
      user.id.toString(),
    )

    if (!userProfile) {
      return left(new ResourceNotFound('User profile not found.'))
    }

    userProfile.profile.avatar = avatar

    await this.userRepository.save(user)

    return right({
      user,
    })
  }
}
