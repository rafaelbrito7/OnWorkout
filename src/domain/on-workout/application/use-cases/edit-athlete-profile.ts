import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from './errors/resource-not-found'
import { Unauthorized } from './errors/unauthorized'
import { AthleteProfileRepository } from '../repositories/athlete-profile.repository'
import { AthleteProfile } from '../../enterprise/entities/athlete-profile'

interface EditAthleteProfileUseCaseRequest {
  userId: string
  currentUserId: string
  firstName: string
  lastName: string
  avatar?: string
}

type EditAthleteProfileUseCaseResponse = Either<
  ResourceNotFound | Unauthorized,
  { athleteProfile: AthleteProfile }
>

export class EditAthleteProfileUseCase {
  constructor(private athleteProfileRepository: AthleteProfileRepository) {}

  async execute({
    userId,
    currentUserId,
    firstName,
    lastName,
    avatar,
  }: EditAthleteProfileUseCaseRequest): Promise<EditAthleteProfileUseCaseResponse> {
    const athleteProfile =
      await this.athleteProfileRepository.findByUserId(userId)

    if (!athleteProfile) {
      return left(new ResourceNotFound('Athlete profile was not found.'))
    }

    if (athleteProfile.userId.toString() !== currentUserId)
      return left(new Unauthorized())

    athleteProfile.firstName = firstName
    athleteProfile.lastName = lastName
    athleteProfile.avatar = avatar

    await this.athleteProfileRepository.save(athleteProfile)

    return right({
      athleteProfile,
    })
  }
}
