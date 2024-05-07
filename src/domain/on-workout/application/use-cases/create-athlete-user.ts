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
  constructor(private userRepository: UserRepository) {}

  async execute({
    currentUserId,
    email,
    profile,
  }: CreateAthleteUserUseCaseRequest): Promise<CreateAthleteUserUseCaseResponse> {
    const userWhoRegistered = await this.userRepository.findById(currentUserId)

    if (!userWhoRegistered) {
      return left(new ResourceNotFound('User not found.'))
    }

    if (userWhoRegistered.profile.role !== Role.Professional) {
      return left(new Unauthorized())
    }

    const userAlreadyExists = await this.userRepository.findByEmail(email)

    if (userAlreadyExists) {
      return left(new Conflict('User already exists.'))
    }

    const password = generatePassword()

    const hashedPassword = await hash(password, 8)

    const athleteProfile = AthleteProfile.create({
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar,
    })

    const user = User.create({
      email,
      password: hashedPassword,
      firstTimeLogin: true,
      profile: athleteProfile,
      profileId: athleteProfile.id,
    })

    await this.userRepository.create(user)

    return right({
      user,
      temporaryPassword: password,
    })
  }
}
