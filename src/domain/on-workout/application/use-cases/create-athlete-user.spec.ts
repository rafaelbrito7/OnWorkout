import { Role } from '@/utils/enums/roles.enum'
import { CreateAthleteUserUseCase } from './create-athlete-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { InMemoryAthleteProfileRepository } from 'test/repositories/in-memory-athlete-profile.repository'
import { InMemoryProfessionalProfileRepository } from 'test/repositories/in-memory-professional-profile.repository'
import { makeUser } from '../../enterprise/factories/make-user'
import { makeProfessionalProfile } from '../../enterprise/factories/make-professional-profile'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryAthleteProfileRepository: InMemoryAthleteProfileRepository
let inMemoryProfessionalProfileRepository: InMemoryProfessionalProfileRepository
let sut: CreateAthleteUserUseCase

describe('Create Athlete User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryAthleteProfileRepository = new InMemoryAthleteProfileRepository()
    inMemoryProfessionalProfileRepository =
      new InMemoryProfessionalProfileRepository()

    sut = new CreateAthleteUserUseCase(
      inMemoryUserRepository,
      inMemoryAthleteProfileRepository,
      inMemoryProfessionalProfileRepository,
    )
  })

  it('should be able to create an athlete user', async () => {
    const professionalUser = makeUser({
      role: Role.Professional,
    })

    const professionalProfile = makeProfessionalProfile({
      user: professionalUser,
      userId: professionalUser.id,
    })

    inMemoryUserRepository.items.push(professionalUser)
    inMemoryProfessionalProfileRepository.items.push(professionalProfile)

    const result = await sut.execute({
      currentUserId: professionalUser.id.toString(),
      email: 'user@email.com',
      profile: {
        firstName: 'User',
        lastName: 'Name',
      },
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryAthleteProfileRepository.items[0]).toMatchObject({
      firstName: 'User',
      lastName: 'Name',
      user: {
        role: Role.Athlete,
      },
    })
    if (!result.isLeft()) {
      expect(result.value.temporaryPassword).toBeTruthy()
    }
  })
})
