import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user.repository'
import { Either, left, right } from '@/core/either'
import { Conflict } from './errors/conflict'
import { Role } from '@/utils/enums/roles.enum'
import { UserProfile } from '../../enterprise/entities/user-profile'
import { hash } from 'bcryptjs'
import { generatePassword } from '@/utils/functions/generatePassword'
import { AthleteProfile } from '../../enterprise/entities/athlete-profile'

interface CreateAthleteUserUseCaseRequest {
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
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    profile,
  }: CreateAthleteUserUseCaseRequest): Promise<CreateAthleteUserUseCaseResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(email)

    if (userAlreadyExists) {
      return left(new Conflict('User already exists.'))
    }

    const password = generatePassword()

    const hashedPassword = await hash(password, 8)

    const user = User.create({
      email,
      password: hashedPassword,
    })

    const athleteProfile = AthleteProfile.create(profile)

    const userProfile = UserProfile.create({
      userId: user.id,
      profileId: athleteProfile.id,
      profile: athleteProfile,
      role: Role.Athlete,
    })

    user.userProfile = userProfile
    user.firstTimeLogin = true

    await this.userRepository.create(user)

    return right({
      user,
      temporaryPassword: password,
    })
  }
}
