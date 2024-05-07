import { Role } from '@/utils/enums/roles.enum'
import { User } from '../../enterprise/entities/user'
import { ProfessionalProfileRepository } from '../repositories/professional-profile.repository'
import { AthleteProfileRepository } from '../repositories/athlete-profile.repository'

export class SpecializationProfile {
  constructor(
    private readonly professionalProfileRepository: ProfessionalProfileRepository,
    private readonly athleteProfileRepository: AthleteProfileRepository,
  ) {
    this.professionalProfileRepository = professionalProfileRepository
    this.athleteProfileRepository = athleteProfileRepository
  }

  async execute(user: User) {
    const userRole = user.role

    switch (userRole) {
      case Role.Professional:
        return this.professionalProfileRepository.findById(
          user.profileId.toString(),
        )
      case Role.Athlete:
        return this.athleteProfileRepository.findById(user.profileId.toString())
      default:
        throw new Error('User role not found.')
    }
  }
}
