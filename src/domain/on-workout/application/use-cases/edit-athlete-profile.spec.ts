import { Unauthorized } from './errors/unauthorized'
import { InMemoryAthleteProfileRepository } from 'test/repositories/in-memory-athlete-profile.repository'
import { EditAthleteProfileUseCase } from './edit-athlete-profile'
import { makeAthleteProfile } from '../../enterprise/factories/make-athlete-profile'

let inMemoryAthleteProfileRepository: InMemoryAthleteProfileRepository
let sut: EditAthleteProfileUseCase

describe('Edit Athlete Profile', () => {
  beforeEach(() => {
    inMemoryAthleteProfileRepository = new InMemoryAthleteProfileRepository()

    sut = new EditAthleteProfileUseCase(inMemoryAthleteProfileRepository)
  })

  it('should be able to edit a athlete profile', async () => {
    const athleteProfile = makeAthleteProfile({
      firstName: 'Old Name',
      lastName: 'Old Last Name',
      avatar: 'old-avatar',
    })

    inMemoryAthleteProfileRepository.items.push(athleteProfile)

    const result = await sut.execute({
      userId: athleteProfile.userId.toString(),
      currentUserId: athleteProfile.userId.toString(),
      firstName: 'New Name',
      lastName: 'New Last Name',
      avatar: 'new-avatar',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryAthleteProfileRepository.items[0]).toMatchObject({
      firstName: 'New Name',
      lastName: 'New Last Name',
      avatar: 'new-avatar',
    })
  })

  it('should not be able to edit a athlete profile if current user is not who owns the profile', async () => {
    const athleteProfile = makeAthleteProfile({
      firstName: 'Old Name',
      lastName: 'Old Last Name',
      avatar: 'old-avatar',
    })

    inMemoryAthleteProfileRepository.items.push(athleteProfile)

    const result = await sut.execute({
      userId: athleteProfile.userId.toString(),
      currentUserId: 'not-the-owner-id',
      firstName: 'New Name',
      lastName: 'New Last Name',
      avatar: 'new-avatar',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(Unauthorized)
  })
})
