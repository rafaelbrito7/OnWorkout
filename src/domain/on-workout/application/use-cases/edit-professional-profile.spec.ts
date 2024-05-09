import { Unauthorized } from './errors/unauthorized'
import { InMemoryProfessionalProfileRepository } from 'test/repositories/in-memory-professional-profile.repository'
import { EditProfessionalProfileUseCase } from './edit-professional-profile'
import { makeProfessionalProfile } from '../../enterprise/factories/make-professional-profile'

let inMemoryProfessionalProfileRepository: InMemoryProfessionalProfileRepository
let sut: EditProfessionalProfileUseCase

describe('Edit Professional Profile', () => {
  beforeEach(() => {
    inMemoryProfessionalProfileRepository =
      new InMemoryProfessionalProfileRepository()

    sut = new EditProfessionalProfileUseCase(
      inMemoryProfessionalProfileRepository,
    )
  })

  it('should be able to edit a professional profile', async () => {
    const professionalProfile = makeProfessionalProfile({
      firstName: 'Old Name',
      lastName: 'Old Last Name',
      avatar: 'old-avatar',
    })

    inMemoryProfessionalProfileRepository.items.push(professionalProfile)

    const result = await sut.execute({
      userId: professionalProfile.userId.toString(),
      currentUserId: professionalProfile.userId.toString(),
      firstName: 'New Name',
      lastName: 'New Last Name',
      avatar: 'new-avatar',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryProfessionalProfileRepository.items[0]).toMatchObject({
      firstName: 'New Name',
      lastName: 'New Last Name',
      avatar: 'new-avatar',
    })
  })

  it('should not be able to edit a professional profile if current user is not who owns the profile', async () => {
    const professionalProfile = makeProfessionalProfile({
      firstName: 'Old Name',
      lastName: 'Old Last Name',
      avatar: 'old-avatar',
    })

    inMemoryProfessionalProfileRepository.items.push(professionalProfile)

    const result = await sut.execute({
      userId: professionalProfile.userId.toString(),
      currentUserId: 'not-the-owner-id',
      firstName: 'New Name',
      lastName: 'New Last Name',
      avatar: 'new-avatar',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(Unauthorized)
  })
})
