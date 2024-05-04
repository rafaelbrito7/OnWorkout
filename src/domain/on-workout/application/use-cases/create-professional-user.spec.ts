import { Role } from '@/utils/enums/roles.enum'
import { CreateProfessionalUserUseCase } from './create-professional-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'

let inMemoryUserRepository: InMemoryUserRepository
let sut: CreateProfessionalUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new CreateProfessionalUserUseCase(inMemoryUserRepository)
  })

  it('should be able to create a professional user', async () => {
    const result = await sut.execute({
      email: 'user@email.com',
      password: 'password',
      profile: {
        firstName: 'User',
        lastName: 'Name',
      },
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryUserRepository.items[0]).toMatchObject({
      email: 'user@email.com',
    })
    expect(inMemoryUserRepository.items[0].userProfile).toMatchObject({
      role: Role.Professional,
    })
  })
})
