import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from './errors/resource-not-found'
import { Unauthorized } from './errors/unauthorized'
import { ProfessionalProfileRepository } from '../repositories/professional-profile.repository'
import { ProfessionalProfile } from '../../enterprise/entities/professional-profile'

interface EditProfessionalProfileUseCaseRequest {
  userId: string
  currentUserId: string
  firstName: string
  lastName: string
  avatar?: string
}

type EditProfessionalProfileUseCaseResponse = Either<
  ResourceNotFound | Unauthorized,
  { professionalProfile: ProfessionalProfile }
>

export class EditProfessionalProfileUseCase {
  constructor(
    private professionalProfileRepository: ProfessionalProfileRepository,
  ) {}

  async execute({
    userId,
    currentUserId,
    firstName,
    lastName,
    avatar,
  }: EditProfessionalProfileUseCaseRequest): Promise<EditProfessionalProfileUseCaseResponse> {
    const professionalProfile =
      await this.professionalProfileRepository.findByUserId(userId)

    if (!professionalProfile) {
      return left(new ResourceNotFound('Professional profile was not found.'))
    }

    if (professionalProfile.userId.toString() !== currentUserId)
      return left(new Unauthorized())

    professionalProfile.firstName = firstName
    professionalProfile.lastName = lastName
    professionalProfile.avatar = avatar

    await this.professionalProfileRepository.save(professionalProfile)

    return right({
      professionalProfile,
    })
  }
}
