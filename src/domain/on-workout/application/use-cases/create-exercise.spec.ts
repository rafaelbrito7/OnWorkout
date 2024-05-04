import { InMemoryCustomExerciseRepository } from 'test/repositories/in-memory-custom-exercise-repository'
import { CreateExerciseUseCase } from './create-exercise'
import { InMemoryUserProfileRepository } from 'test/repositories/in-memory-user-profile.repository'
import { makeUserProfile } from '../../enterprise/factories/make-user-profile'

let inMemoryUserProfileRepository: InMemoryUserProfileRepository
let inMemoryCustomExerciseRepository: InMemoryCustomExerciseRepository
let sut: CreateExerciseUseCase

describe('Create Exercise', () => {
  beforeEach(() => {
    inMemoryUserProfileRepository = new InMemoryUserProfileRepository()
    inMemoryCustomExerciseRepository = new InMemoryCustomExerciseRepository()
    sut = new CreateExerciseUseCase(
      inMemoryUserProfileRepository,
      inMemoryCustomExerciseRepository,
    )
  })

  it('should be able to create a custom exercise', async () => {
    const userProfile = makeUserProfile()

    inMemoryUserProfileRepository.create(userProfile)

    const result = await sut.execute({
      currentUserId: userProfile.userId.toString(),
      name: 'exercise name',
      description: 'exercise description',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryCustomExerciseRepository.items[0]).toMatchObject({
      name: 'exercise name',
      description: 'exercise description',
      createdById: userProfile.id,
    })
  })
})
