import { CreateProfessionalUserUseCase } from './create-professional-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { InMemoryProfessionalProfileRepository } from 'test/repositories/in-memory-professional-profile.repository'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryProfessionalProfileRepository: InMemoryProfessionalProfileRepository
let sut: CreateProfessionalUserUseCase

describe('Create Professional User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryProfessionalProfileRepository =
      new InMemoryProfessionalProfileRepository()

    sut = new CreateProfessionalUserUseCase(
      inMemoryUserRepository,
      inMemoryProfessionalProfileRepository,
    )
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
    expect(inMemoryProfessionalProfileRepository[0]).toMatchObject({
      firstName: 'User',
      lastName: 'Name',
    })
  })
})
