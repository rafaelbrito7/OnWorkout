import { Role } from '@/utils/enums/roles.enum'
import { InMemoryCustomExerciseRepository } from 'test/repositories/in-memory-custom-exercise-repository'
import { InMemoryUserProfileRepository } from 'test/repositories/in-memory-user-profile.repository'
import { makeUserProfile } from '../../enterprise/factories/make-user-profile'
import { EditExerciseUseCase } from './edit-exercise'
import { makeExercise } from '../../enterprise/factories/make-exercise'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Unauthorized } from './errors/unauthorized'

let inMemoryUserProfileRepository: InMemoryUserProfileRepository
let inMemoryCustomExerciseRepository: InMemoryCustomExerciseRepository
let sut: EditExerciseUseCase

describe('Edit Exercise', () => {
  beforeEach(() => {
    inMemoryUserProfileRepository = new InMemoryUserProfileRepository()
    inMemoryCustomExerciseRepository = new InMemoryCustomExerciseRepository()
    sut = new EditExerciseUseCase(
      inMemoryUserProfileRepository,
      inMemoryCustomExerciseRepository,
    )
  })

  it('should be able to edit a custom exercise', async () => {
    const userProfile = makeUserProfile({ role: Role.Professional })
    const exercise = makeExercise({
      name: 'supino reto',
      description: 'exercicio para peitoral',
      createdById: userProfile.id,
    })

    inMemoryUserProfileRepository.create(userProfile)
    inMemoryCustomExerciseRepository.create(exercise)

    const result = await sut.execute({
      currentUserId: userProfile.userId.toString(),
      exerciseId: exercise.id.toString(),
      name: 'supino inclinado',
      description: 'exercicio para peitoral superior',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryCustomExerciseRepository.items[0]).toMatchObject({
      name: 'supino inclinado',
      description: 'exercicio para peitoral superior',
    })
  })

  it('should not be able to edit a custom exercise if user is not the creator', async () => {
    const userProfile = makeUserProfile({ role: Role.Professional })

    const exercise = makeExercise({
      name: 'supino reto',
      description: 'exercicio para peitoral',
      createdById: new UniqueEntityID('another-id'),
    })

    inMemoryUserProfileRepository.create(userProfile)
    inMemoryCustomExerciseRepository.create(exercise)

    const result = await sut.execute({
      currentUserId: userProfile.userId.toString(),
      exerciseId: exercise.id.toString(),
      name: 'supino inclinado',
      description: 'exercicio para peitoral superior',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(Unauthorized)
  })
})
