import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from './errors/resource-not-found'
import { Unauthorized } from './errors/unauthorized'
import { ProfessionalProfileRepository } from '../repositories/professional-profile.repository'
import { ProfessionalProfile } from '../../enterprise/entities/professional-profile'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditProfessionalProfileUseCaseRequest {
  userProfileId: string
  currentUserProfileId: string
  firstName: string
  lastName: string
  avatar?: string
  workoutPlans: UniqueEntityID[]
  createdAt: Date
  updatedAt?: Date
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
    userProfileId,
    currentUserProfileId,
    firstName,
    lastName,
    avatar,
  }: EditProfessionalProfileUseCaseRequest): Promise<EditProfessionalProfileUseCaseResponse> {
    const professionalProfile =
      await this.professionalProfileRepository.findByUserProfileId(
        userProfileId,
      )

    if (!professionalProfile) {
      return left(new ResourceNotFound('Professional profile was not found.'))
    }

    if (professionalProfile.userProfileId.toString() !== currentUserProfileId)
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
