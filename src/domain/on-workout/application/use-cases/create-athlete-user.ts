import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user.repository'
import { Either, left, right } from '@/core/either'
import { Conflict } from './errors/conflict'
import { hash } from 'bcryptjs'
import { generatePassword } from '@/utils/functions/generatePassword'
import { AthleteProfile } from '../../enterprise/entities/athlete-profile'
import { ResourceNotFound } from './errors/resource-not-found'
import { Unauthorized } from './errors/unauthorized'
import { Role } from '@/utils/enums/roles.enum'
import { AthleteProfileRepository } from '../repositories/athlete-profile.repository'
import { ProfessionalProfileRepository } from '../repositories/professional-profile.repository'

interface CreateAthleteUserUseCaseRequest {
  currentUserId: string
  email: string
  profile: {
    firstName: string
    lastName: string
    avatar?: string
  }
}

type CreateAthleteUserUseCaseResponse = Either<
  Conflict,
  { user: User; temporaryPassword: string }
>

export class CreateAthleteUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private athleteProfileRepository: AthleteProfileRepository,
    private professionalProfileRepository: ProfessionalProfileRepository,
  ) {}

  async execute({
    currentUserId,
    email,
    profile,
  }: CreateAthleteUserUseCaseRequest): Promise<CreateAthleteUserUseCaseResponse> {
    const professional =
      await this.professionalProfileRepository.findByUserId(currentUserId)

    if (!professional) {
      return left(new ResourceNotFound('User not found.'))
    }

    if (professional.user.role !== Role.Professional) {
      return left(new Unauthorized())
    }

    const athleteAlreadyExists = await this.userRepository.findByEmail(email)

    if (athleteAlreadyExists) {
      return left(new Conflict('Athlete is already registered.'))
    }

    const temporaryPassword = generatePassword()

    const hashedTemporaryPassword = await hash(temporaryPassword, 8)

    const user = User.create({
      email,
      password: hashedTemporaryPassword,
      firstTimeLogin: true,
      role: Role.Athlete,
    })

    const athleteProfile = AthleteProfile.create({
      ...profile,
      userId: user.id,
      user,
    })

    await this.athleteProfileRepository.create(athleteProfile)

    return right({
      user,
      temporaryPassword,
    })
  }
}
