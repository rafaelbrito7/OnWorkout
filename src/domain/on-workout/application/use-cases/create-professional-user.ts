import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user.repository'
import { Either, left, right } from '@/core/either'
import { Conflict } from './errors/conflict'
import { ProfessionalProfile } from '../../enterprise/entities/professional-profile'
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

    const professionalProfile = ProfessionalProfile.create(profile)

    const user = User.create({
      email,
      password: hashedPassword,
      firstTimeLogin: false,
      profile: professionalProfile,
      profileId: professionalProfile.id,
    })

    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
