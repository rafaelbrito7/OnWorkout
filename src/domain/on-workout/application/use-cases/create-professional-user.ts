import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user.repository'
import { Either, left, right } from '@/core/either'
import { Conflict } from './errors/conflict'
import { Role } from '@/utils/enums/roles.enum'
import { ProfessionalProfile } from '../../enterprise/entities/professional-profile'
import { UserProfile } from '../../enterprise/entities/user-profile'
import { hash } from 'bcryptjs'

interface CreateProfessionalUserUseCaseRequest {
  email: string
  password: string
  profile: {
    firstName: string
    lastName: string
    avatar?: string
  }
}

type CreateProfessionalUserUseCaseResponse = Either<Conflict, { user: User }>

export class CreateProfessionalUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
    profile,
  }: CreateProfessionalUserUseCaseRequest): Promise<CreateProfessionalUserUseCaseResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(email)

    if (userAlreadyExists) {
      return left(new Conflict('User already exists.'))
    }

    const hashedPassword = await hash(password, 8)

    const user = User.create({
      email,
      password: hashedPassword,
    })

    const professionalProfile = ProfessionalProfile.create(profile)

    const userProfile = UserProfile.create({
      userId: user.id,
      profileId: professionalProfile.id,
      profile: professionalProfile,
      role: Role.Professional,
    })

    user.userProfile = userProfile
    user.firstTimeLogin = false

    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
