import { UniqueEntityID } from '../../core/entities/unique-entity-id'
import { User } from '../entities/user'
import { IUserRepository } from '../repositories/user.repository'

interface ICreateUserUseCaseRequest {
  email: string
  password: string
  profileId: string
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password, profileId }: ICreateUserUseCaseRequest) {
    const user = User.create({
      email,
      password,
      profileId: new UniqueEntityID(profileId),
    })

    await this.userRepository.create(user)

    return user
  }
}
