import { Role } from '@/utils/enums/roles.enum'
import { CreateAthleteUserUseCase } from './create-athlete-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'

let inMemoryUserRepository: InMemoryUserRepository
let sut: CreateAthleteUserUseCase

describe('Create Athlete User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new CreateAthleteUserUseCase(inMemoryUserRepository)
  })

  it('should be able to create an athlete user', async () => {
    const result = await sut.execute({
      email: 'user@email.com',
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
      role: Role.Athlete,
    })
    if (!result.isLeft()) {
      expect(result.value.temporaryPassword).toBeTruthy()
    }
  })
})
