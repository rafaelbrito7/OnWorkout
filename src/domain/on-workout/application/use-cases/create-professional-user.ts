import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user.repository'
import { Either, left, right } from '@/core/either'
import { Conflict } from './errors/conflict'
import { ProfessionalProfile } from '../../enterprise/entities/professional-profile'
import { hash } from 'bcryptjs'
import { Role } from '@/utils/enums/roles.enum'
import { ProfessionalProfileRepository } from '../repositories/professional-profile.repository'

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
  constructor(
    private userRepository: UserRepository,
    private professionalProfileRepository: ProfessionalProfileRepository,
  ) {}

  async execute({
    email,
    password,
    profile,
  }: CreateProfessionalUserUseCaseRequest): Promise<CreateProfessionalUserUseCaseResponse> {
    const professionalAlreadyExists =
      await this.userRepository.findByEmail(email)

    if (professionalAlreadyExists) {
      return left(new Conflict('Professional is already registered.'))
    }

    const hashedPassword = await hash(password, 8)

    const user = User.create({
      email,
      password: hashedPassword,
      firstTimeLogin: false,
      role: Role.Professional,
    })

    const professionalProfile = ProfessionalProfile.create({
      ...profile,
      userId: user.id,
      user,
    })

    await this.professionalProfileRepository.create(professionalProfile)

    return right({
      user,
    })
  }
}
